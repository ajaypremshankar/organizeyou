import { BaseTasksState } from "./base-tasks-state";
import { CompletedTask, ListType, SettingsType, Task, TaskSorter } from "./types";
import { updateAppState } from "../utils/app-state-facade-utils";
import { DisplayableTaskList } from "./displayable-task-list";
import { getTodayKey } from "../utils/date-utils";

/**
 * Exposing app state to rest of the app.
 * This pattern will make decision to use Redux in future easier.
 * <b>This class will NOT change state data </b>
 * NOTE: Logic for transforming and returned curated state related info stays with `StateStore`
 */
export class StateStore {
    private static baseState: BaseTasksState
    private static setBaseState: any

    public static initStore = (state: BaseTasksState, setState: any) => {
        StateStore.baseState = state
        StateStore.setBaseState = setState;
    }

    public static setToStore = (state: BaseTasksState) => {
        StateStore.baseState = state
    }

    public static getTasks = (): Map<number, Task[]> => {
        return new Map<number, Task[]>(StateStore.baseState.tasks)
    }

    public static updateBaseState = (newState: BaseTasksState, persist: boolean = true) => {
        if (persist) {
            updateAppState(newState)
        }
        StateStore.setBaseState(newState)
        StateStore.setToStore(newState)
    }

    public static updateCurrentlySelectedDate = (date: number) => {
        StateStore.updateBaseState(StateStore.baseState.updateCurrentlySelectedDate(date), false)
    }

    public static handleTaskCompletion = (key: number, task: Task) => {
        StateStore.updateBaseState(StateStore.baseState.completeTask(key, task))
    }

    public static handleTaskAddition = (key: number, task: Task) => {
        StateStore.updateBaseState(StateStore.baseState.addTask(key, task))
    }

    public static handleTaskDeletion = (key: number, task: Task) => {
        StateStore.updateBaseState(StateStore.baseState.removeTask(key, task))
    }

    public static handleTaskMovement = (from: number, to: number, task: Task) => {
        StateStore.updateBaseState(StateStore.baseState.moveTask(from, to, task))
    }

    public static handleUndoComplete = (task: CompletedTask) => {
        StateStore.updateBaseState(StateStore.baseState.undoCompleteTask(task))
    }

    public static handleSettingsToggle = (type: SettingsType) => {
        StateStore.updateBaseState(StateStore.baseState.toggleSetting(type))
    }

    public static handleFullModeToggle = () => {
        StateStore.updateBaseState(StateStore.baseState.toggleFullMode())
    }

    public static handleShowAllToggle = () => {
        StateStore.updateBaseState(StateStore.baseState.toggleSetting(SettingsType.SHOW_ALL_TASKS), true)
    }

    public static isShowAllTasks = () => {
        return StateStore.baseState.settings.get(SettingsType.SHOW_ALL_TASKS) || false
    }

    public static isFullMode = () => {
        return StateStore.baseState.fullMode || false
    }

    public static getTargetTasks = (sorter?: TaskSorter) => {
        if (StateStore.isShowAllTasks()) {
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