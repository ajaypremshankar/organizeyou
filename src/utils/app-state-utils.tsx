import {CompletedTask, SettingsType, Task} from "../types/types";
import {BaseTasksState} from "../types/base-tasks-state";
import {getCurrentMillis, getTodayKey} from "./date-utils";

export const updateAppState = (updatedState: BaseTasksState): BaseTasksState => {

    const state = {
        selectedDate: updatedState.selectedDate,
        tasks: [...Array.from(updatedState.tasks)],
        settings: [...Array.from(updatedState.settings || new Map())]
    }

    localStorage.setItem("organizeyou-base-app-2", JSON.stringify(state))

    return new BaseTasksState(
        state.selectedDate,
        new Map<number, Task[] | CompletedTask[]>(state.tasks),
        new Map<SettingsType, boolean>(state.settings)
    )
}


export const loadAppState = (): BaseTasksState => {

    const persistedState = localStorage.getItem("organizeyou-base-app-2");

    if (persistedState && !persistedState.includes('createdDate')) {
        const updatedState = migrateFromV200ToV210(persistedState)
        updateAppState(updatedState)

        return new BaseTasksState(
            updatedState.selectedDate,
            new Map<number, Task[] | CompletedTask[]>(updatedState.tasks),
            updatedState.settings ? new Map<SettingsType, boolean>(updatedState.settings) : new Map(),
            true
        )
    } else if (persistedState) {
        const state = JSON.parse(persistedState)
        return new BaseTasksState(
            state.selectedDate,
            new Map<number, Task[] | CompletedTask[]>(state.tasks),
            state.settings ? new Map<SettingsType, boolean>(state.settings) : new Map(),
            true
        )
    } else {
        return new BaseTasksState(
            getTodayKey(),
            new Map<number, Task[] | CompletedTask[]>(),
            new Map<SettingsType, boolean>(),
        )
    }
}


/***
 * Add createdDate and updatedDate to currently created tasks.
 * Add current list field to existing tasks
 * @param persistedState
 */
function migrateFromV200ToV210(persistedState: string) {
    const state = JSON.parse(persistedState)
    const now = getCurrentMillis()

    const tasks = state.tasks.map((stateKeyValue: [number, any[]]) => {
        const taskArr = stateKeyValue[1].map(value => {
            if (!value.createdDate) {
                return {
                    ...value,
                    createdOn: now,
                    updatedOn: now
                }
            }
            return value
        })

        return [stateKeyValue[0], [...taskArr]]
    })

    return {
        ...state,
        tasks: tasks
    }
}