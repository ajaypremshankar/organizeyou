import { CompletedTask, SettingsType, Task } from "../types/types";
import { BaseTasksState } from "../types/base-tasks-state";
import { getCurrentMillis } from "./date-utils";
import { getEffectiveSelectedDate } from "./settings-utils";
import { emptyState } from "./app-state-facade-utils";

export const updateLocalAppState = (updatedState: BaseTasksState) => {

    const state = {
        selectedDate: updatedState.selectedDate,
        tasks: [...Array.from(updatedState.tasks)],
        settings: [...Array.from(updatedState.settings || new Map())]
    }

    localStorage.setItem("organizeyou-base-app-2", JSON.stringify(state))
}


export const loadLocalAppState = (): Promise<BaseTasksState> => {

    const persistedState = localStorage.getItem("organizeyou-base-app-2");

    if (!persistedState) {
        return new Promise((resolve, reject) => {
            resolve(emptyState())
        })
    }

    let updatedState: any

    if (!persistedState.includes('createdDate')) {
        updatedState = migrateFromV200ToV210(persistedState)
        updateLocalAppState(updatedState)
    } else {
        updatedState = JSON.parse(persistedState)
    }

    const settings = updatedState.settings ? new Map<SettingsType, boolean>(updatedState.settings) : new Map()
    const selectedDate = getEffectiveSelectedDate(settings, updatedState.selectedDate)

    return new Promise((resolve, reject) => {
        resolve(new BaseTasksState(
            selectedDate,
            new Map<number, Task[] | CompletedTask[]>(updatedState.tasks),
            settings,
            true
        ))
    })
}


/***
 * Add createdDate and updatedDate to currently created tasks.
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