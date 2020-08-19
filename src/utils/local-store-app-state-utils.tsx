import { BaseTasksState } from "../types/base-tasks-state";
import { getTodayKey } from "./date-utils";
import { Task } from "../types/types";

export const updateLocalAppState = (updatedState: BaseTasksState) => {

    const state = {
        selectedDate: updatedState.selectedDate,
        tasks: [...Array.from(updatedState.tasks)],
        completedTasks: updatedState.completedTasks,
    }

    localStorage.setItem("organizeyou-base-app-2", JSON.stringify(state))
}


export const loadLocalAppState = (): Promise<BaseTasksState> => {

    const persistedState = localStorage.getItem("organizeyou-base-app-2");

    if (!persistedState) {
        return new Promise((resolve, reject) => {
            resolve(BaseTasksState.emptyState())
        })
    }

    const updatedState = JSON.parse(persistedState)
    const migratedState = BaseTasksState.newStateFrom(
        // Load today by default
        getTodayKey(),
        new Map<number, Task[]>(updatedState.tasks),
        updatedState.completedTasks,
    )

    return new Promise((resolve, reject) => {
        resolve(migratedState)
    })
}

export const clearLocalStorageState = () => {
    localStorage.removeItem("organizeyou-base-app-2")
}