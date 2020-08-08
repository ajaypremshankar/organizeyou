import { BaseTasksState } from "./base-tasks-state";
import { Task } from "./types";

export class StateStore {
    private static baseState: BaseTasksState

    public static setCurrentState = (state: BaseTasksState) => {
        StateStore.baseState = state
    }

    public static getTasksMap = (): Map<number, Task[]> => {
        return new Map<number, Task[]>(StateStore.baseState.tasks)
    }
}