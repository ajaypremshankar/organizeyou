import { CompletedTask, SettingsType, Task } from "../types/types";
import { BaseTasksState } from "../types/base-tasks-state";
import { getTodayKey } from "./date-utils";
import { migrateCompletedListFromMap, migrateOverdueListToDateList } from "./migration-utils";
import { loadLocalSettingsState, updateLocalSettingsState } from "./settings-local-storage";

export const updateLocalAppState = (updatedState: BaseTasksState) => {

    const state = {
        selectedDate: updatedState.selectedDate,
        tasks: [...Array.from(updatedState.tasks)],
        completedTasks: updatedState.completedTasks,
        settings: [...Array.from(updatedState.settings || new Map())]
    }

    localStorage.setItem("organizeyou-base-app-2", JSON.stringify(state))

    updateLocalSettingsState({fullMode: updatedState.fullMode})
}


export const loadLocalAppState = (): Promise<BaseTasksState> => {

    const persistedState = localStorage.getItem("organizeyou-base-app-2");

    if (!persistedState) {
        return new Promise((resolve, reject) => {
            resolve(BaseTasksState.emptyState())
        })
    }

    const updatedState = JSON.parse(persistedState)

    const settings = updatedState.settings ? new Map<SettingsType, boolean>(updatedState.settings) : new Map()

    const newTasks = migrateOverdueListToDateList(new Map<number, Task[] | CompletedTask[]>(updatedState.tasks))
    const localSettings = loadLocalSettingsState()
    const migratedState = migrateCompletedListFromMap(BaseTasksState.newStateFrom(
        // Load today by default
        getTodayKey(),
        newTasks,
        updatedState.completedTasks,
        settings,
        localSettings.fullMode
    ))

    return new Promise((resolve, reject) => {
        resolve(migratedState)
    })
}

export const clearLocalStorageState = () => {
    localStorage.removeItem("organizeyou-base-app-2")
}