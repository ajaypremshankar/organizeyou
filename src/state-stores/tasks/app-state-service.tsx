import { TasksState } from "./tasks-state";
import { CompletedTask, HashTagTaskMapping, ListType, Task, TaskSorter } from "../../types/types";
import { AppStateRepository } from "./app-state-repository";
import { DisplayableTaskList } from "../../types/displayable-task-list";
import { formatToKey, getTodayKey } from "../../utils/date-utils";
import { KeyTitleUtils } from "../../utils/key-title-utils";
import { SettingsStateService, SettingsType } from "../settings/settings-state";
import { TASK_STATE_ACTION } from "../bucket/bucket-utils";
import { HashTagUtils } from "../hash-tags/hash-tag-utils";
import { HashTagRepository } from "../hash-tags/hash-tag-repository";

/**
 * Exposing app state-stores to rest of the app.
 * This pattern will make decision to use Redux in future easier.
 * <b>This class will NOT change state-stores data </b>
 * NOTE: Logic for transforming and returned curated state-stores related info stays with `StateStore`
 */
export class AppStateService {
    private static baseState: TasksState
    private static setBaseState: any

    public static initStore = (state: TasksState, setState: any) => {
        AppStateService.baseState = state
        AppStateService.setBaseState = setState;
    }

    static setToStore = (state: TasksState) => {
        AppStateService.setBaseState(state)
        AppStateService.baseState = state
    }

    public static loadState = () => {
        AppStateRepository.loadAppState().then(value => {
            // Since selected Date is not persisted anymore.
            // Don't drop the ball, when it is set in state.
            const selectedDate = AppStateService.baseState?.selectedDate
            const selectedList = AppStateService.baseState?.selectedList
            AppStateService.setBaseState(value)
            if (selectedDate) {
                AppStateService.updateCurrentlySelectedDate(selectedDate)
            }

            if (selectedList) {
                AppStateService.updateCurrentlySelectedList(selectedList)
            }
        })
    }

    public static updateBaseState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task,
                                     newState: TasksState, persist: boolean = true) => {
        if (persist) {
            AppStateRepository.updateAppState(action, plannedOn, targetTask)
        }
        AppStateService.setToStore(newState)
    }

    private static updateHashTagState(deltaHashTags: Map<string, HashTagTaskMapping[]>) {

        if (deltaHashTags.size > 0) {
            HashTagRepository.update(deltaHashTags)
            AppStateService.setToStore(AppStateService.baseState.mergeHashTagMap(deltaHashTags))
        }
    }

    // GETTERS - START --------------------------------------------

    public static getTasks = (): Map<number, Task[]> => {
        return new Map<number, Task[]>(AppStateService.baseState.tasks)
    }

    public static getHashTags = (): Map<string, HashTagTaskMapping[]> => {
        return new Map<string, HashTagTaskMapping[]>(AppStateService.baseState.hashTags)
    }

    public static getSelectedDate = () => {
        return AppStateService.baseState.selectedDate
    }

    public static getSelectedList = () => {
        return AppStateService.baseState.selectedList
    }

    public static getEffectiveTitle = () => {
        return AppStateService.baseState.selectedList !== null && AppStateService.baseState.selectedList !== ''
            ? AppStateService.baseState.selectedList : KeyTitleUtils.getTitleByKey(AppStateService.baseState.selectedDate)
    }

    public static getTargetTasks = (sorter?: TaskSorter) => {

        if (SettingsStateService.isEnabled(SettingsType.SHOW_ALL_TASKS)) {
            const reducedList: Task[] = []

            AppStateService.getTasks().forEach((value, key) => {
                reducedList.push(...value)
            })

            return new DisplayableTaskList(KeyTitleUtils.getTitleByKey(ListType.ALL),  Array.from(new Set(reducedList)), (a: Task | CompletedTask, b: Task | CompletedTask) => {
                return a.plannedOn - b.plannedOn
            })
        } else if (SettingsStateService.isHashTagListVisible()) {
            return AppStateService.getSelectedListTasks(sorter)
        } else {
            return AppStateService.getSelectedDateTasks(sorter)
        }

    }

    public static getSelectedListTasks(sorter?: TaskSorter): DisplayableTaskList {
        const reducedList: Task[] = []

        const tagTaskArr = AppStateService.baseState.hashTags.get(AppStateService.baseState.selectedList) || []

        tagTaskArr.forEach(tag => {
            const taskArr = AppStateService.getTasks().get(tag.plannedOn) || []
            reducedList.push(...(taskArr.filter(x => x.id === tag.taskId)))
        })

        return new DisplayableTaskList(AppStateService.baseState.selectedList, Array.from(new Set(reducedList)), sorter)
    }

    public static getSelectedDateTasks(sorter?: TaskSorter): DisplayableTaskList {
        const reducedList: Task[] = []
        reducedList.push(...(AppStateService.getTasks().get(AppStateService.baseState.selectedDate) || []))
        return new DisplayableTaskList(KeyTitleUtils.getTitleByKey(AppStateService.baseState.selectedDate),  Array.from(new Set(reducedList)), sorter)
    }

    public static getCompletedTasks = (sorter?: TaskSorter) => {
        const reducedList: Task[] = []
        if (SettingsStateService.isEnabled(SettingsType.SHOW_ALL_TASKS)) {
            reducedList.push(...AppStateService.baseState.completedTasks)
        } else if (SettingsStateService.isHashTagListVisible()) {
            const tagTaskArr = AppStateService.baseState.hashTags.get(AppStateService.baseState.selectedList) || []
            tagTaskArr.forEach(tag => {
                reducedList.push(...(AppStateService.baseState.completedTasks.filter(x => x.id === tag.taskId)))
            })
        } else {
            reducedList.push(...(AppStateService.baseState.completedTasks.filter(x => formatToKey(new Date(x.completedDate)) === AppStateService.getSelectedDate())))
        }
        return new DisplayableTaskList(KeyTitleUtils.getTitleByKey(ListType.COMPLETED), reducedList, sorter)
    }

    public static getOverdueTasks = (sorter?: TaskSorter) => {
        const reducedList: Task[] = AppStateService.computeOverdueTasks(AppStateService.getTasks())
        if (SettingsStateService.isHashTagListVisible()) {
            const tagTaskArr = AppStateService.baseState.hashTags.get(AppStateService.baseState.selectedList) || []
            const furtherReducedList: Task[] = []
            tagTaskArr.forEach(tag => {
                furtherReducedList.push(...(reducedList.filter(x => x.id === tag.taskId)))
            })
            return new DisplayableTaskList(KeyTitleUtils.getTitleByKey(ListType.OVERDUE), furtherReducedList, sorter)
        } else {
            return new DisplayableTaskList(KeyTitleUtils.getTitleByKey(ListType.OVERDUE), reducedList, sorter)
        }
    }

    public static pendingTasksCount = () => {
        return AppStateService.computeOverdueTasks(AppStateService.getTasks()).length
            + (AppStateService.getTasks().get(getTodayKey()) || []).length
    }

    // GETTERS - END --------------------------------------------

    // SETTERS - START ------------------------------------------

    public static updateCurrentlySelectedDate = (date: number) => {
        AppStateService.setToStore(AppStateService.baseState.updateCurrentlySelectedDate(date))
        SettingsStateService.setShowHashTags(false)
    }

    public static updateCurrentlySelectedList = (list: string) => {
        AppStateService.setToStore(AppStateService.baseState.updateCurrentlySelectedList(list))
        SettingsStateService.setShowHashTags(true)
    }

    public static handleTaskCompletion = (task: CompletedTask) => {

        AppStateService.updateBaseState(
            TASK_STATE_ACTION.COMPLETE_TASK, task.plannedOn, task,
            AppStateService.baseState.completeTask(task))

        AppStateService.updateHashTagState(HashTagUtils.completeHashTags(task, AppStateService.baseState.hashTags));
    }

    public static handleTaskAdditionOrUpdation = (currentTask: Task | null, newTask: Task) => {
        AppStateService.updateBaseState(
            TASK_STATE_ACTION.ADD_UPDATE_TASK, newTask.plannedOn, newTask,
            AppStateService.baseState.addOrUpdateTask(newTask))

        AppStateService.updateHashTagState(HashTagUtils.addOrUpdateHashTags(currentTask, newTask, AppStateService.baseState.hashTags));
    }

    public static handleTaskDeletion = (task: Task) => {
        AppStateService.updateBaseState(
            TASK_STATE_ACTION.DELETE_TASK, task.plannedOn, task,
            AppStateService.baseState.removeTask(task))

        AppStateService.updateHashTagState(HashTagUtils.deleteHashTags(task, AppStateService.baseState.hashTags));
    }

    public static handleCompletedTaskDeletion = (task: CompletedTask) => {
        AppStateService.updateBaseState(
            TASK_STATE_ACTION.DELETE_COMPLETED_TASK, task.plannedOn, task,
            AppStateService.baseState.removeCompletedTask(task))

        AppStateService.updateHashTagState(HashTagUtils.deleteHashTags(task, AppStateService.baseState.hashTags));
    }

    public static handleTaskMovement = (from: number, task: Task) => {
        AppStateService.updateBaseState(
            TASK_STATE_ACTION.MOVE_TASK, from, task,
            AppStateService.baseState.moveTask(from, task))

        AppStateService.updateHashTagState(HashTagUtils.moveHashTags(task, AppStateService.baseState.hashTags));
    }

    public static handleUndoComplete = (task: Task) => {
        AppStateService.updateBaseState(
            TASK_STATE_ACTION.UNDO_COMPLETE_TASK, task.plannedOn, task,
            AppStateService.baseState.undoCompleteTask(task))

        AppStateService.updateHashTagState(HashTagUtils.undoCompleteHashTags(task, AppStateService.baseState.hashTags));
    }

    // SETTERS - END --------------------------------------------

    private static computeOverdueTasks(tasks: Map<number, Task[] | CompletedTask[]>): Task[] | CompletedTask[] {
        const reducedList: Task[] = []

        const today = getTodayKey()

        tasks.forEach((value, key) => {
            const tasks: Task[] = value as Task[]
            if (today > key) {
                reducedList.push(...tasks)
            }
        })

        return reducedList
    }

}