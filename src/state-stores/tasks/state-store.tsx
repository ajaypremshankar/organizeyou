import { BaseTasksState } from "./base-tasks-state";
import { CompletedTask, ListType, Task, TaskSorter } from "../../types/types";
import { updateAppState } from "./app-state-facade-utils";
import { DisplayableTaskList } from "../../types/displayable-task-list";
import { getCurrentMillis, getTodayKey } from "../../utils/date-utils";
import { KeyTitlePair } from "../../types/key-title-pair";
import { SettingsStateStore, SettingsType } from "../settings/settings-state";
import { TASK_STATE_ACTION } from "./bucketed-tasks-state-utils";

/**
 * Exposing app state-stores to rest of the app.
 * This pattern will make decision to use Redux in future easier.
 * <b>This class will NOT change state-stores data </b>
 * NOTE: Logic for transforming and returned curated state-stores related info stays with `StateStore`
 */
export class StateStore {
    private static baseState: BaseTasksState
    private static setBaseState: any

    public static initStore = (state: BaseTasksState, setState: any) => {
        StateStore.baseState = state
        StateStore.setBaseState = setState;
    }

    public static setToStore = (state: BaseTasksState) => {
        StateStore.setBaseState(state)
        StateStore.baseState = state
    }

    public static getTasks = (): Map<number, Task[]> => {
        return new Map<number, Task[]>(StateStore.baseState.tasks)
    }

    public static getKeyTitle(): KeyTitlePair {
        return new KeyTitlePair(StateStore.baseState.selectedDate)
    }

    public static updateBaseState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task,
                                     newState: BaseTasksState, persist: boolean = true) => {
        if (persist) {
            updateAppState(action, plannedOn, targetTask, newState)
        }
        StateStore.setToStore(newState)
    }

    public static updateCurrentlySelectedDate = (date: number) => {
        StateStore.setToStore(StateStore.baseState.updateCurrentlySelectedDate(date))
    }

    public static handleTaskCompletion = (key: number, task: Task) => {
        const completeTask: CompletedTask = {
            ...task,
            completedDate: getCurrentMillis(),
        }

        StateStore.updateBaseState(
            TASK_STATE_ACTION.COMPLETE_TASK, key, completeTask,
            StateStore.baseState.completeTask(key, task))
    }

    public static handleTaskAdditionOrUpdation = (key: number, task: Task) => {
        StateStore.updateBaseState(
            TASK_STATE_ACTION.ADD_UPDATE_TASK, key, task,
            StateStore.baseState.addOrUpdateTask(key, task))
    }

    public static handleTaskDeletion = (key: number, task: Task) => {
        StateStore.updateBaseState(
            TASK_STATE_ACTION.DELETE_TASK, key, task,
            StateStore.baseState.removeTask(key, task))
    }

    public static handleTaskMovement = (from: number, to: number, task: Task) => {
        StateStore.updateBaseState(
            TASK_STATE_ACTION.MOVE_TASK, from, task,
            StateStore.baseState.moveTask(from, to, task))
    }

    public static handleUndoComplete = (task: CompletedTask) => {
        StateStore.updateBaseState(
            TASK_STATE_ACTION.UNDO_COMPLETE_TASK, task.plannedOn, task,
            StateStore.baseState.undoCompleteTask(task))
    }

    public static getTargetTasks = (sorter?: TaskSorter) => {
        if (SettingsStateStore.isEnabled(SettingsType.SHOW_ALL_TASKS)) {
            const reducedList: Task[] = []

            StateStore.getTasks().forEach((value, key) => {
                if (key !== ListType.COMPLETED) {
                    reducedList.push(...value)
                }
            })

            return new DisplayableTaskList(ListType.ALL, reducedList, sorter)
        } else {
            return StateStore.getSelectedDateTasks(sorter)
        }
    }

    public static getSelectedDateTasks(sorter?: TaskSorter): DisplayableTaskList {
        const reducedList: Task[] = []
        reducedList.push(...StateStore.getTasks().get(StateStore.baseState.selectedDate) || [])
        return new DisplayableTaskList(StateStore.baseState.selectedDate, reducedList, sorter)
    }

    public static getCompletedTasks = (sorter?: TaskSorter) => {
        return new DisplayableTaskList(ListType.COMPLETED, StateStore.baseState.completedTasks, sorter)
    }

    public static getOverdueTasks = (sorter?: TaskSorter) => {
        const reducedList: Task[] = StateStore.computeOverdueTasks(StateStore.getTasks())
        return new DisplayableTaskList(ListType.OVERDUE, reducedList, sorter)
    }

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

    public static pendingTasksCount = () => {
        return StateStore.computeOverdueTasks(StateStore.getTasks()).length
            + (StateStore.getTasks().get(getTodayKey()) || []).length
    }
}