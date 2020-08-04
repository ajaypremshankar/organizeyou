import { CompletedTask, SettingsType, Task } from "../types/types";
import { BaseTasksState } from "../types/base-tasks-state";
import { emptyState } from "./app-state-facade-utils";
import { getTodayKey } from "./date-utils";
import { migrateCompletedListFromMap, migrateOverdueListToDateList } from "./migration-utils";

/***
 * Separated keys because of storage restrictions on a key
 * https://developer.chrome.com/apps/storage#type-StorageArea
 * @param updatedState
 */
export const updateBrowserAppState = (updatedState: BaseTasksState) => {

    chrome.storage.sync.set({
        'organizeyou_current_tasks': JSON.stringify({
            selectedDate: updatedState.selectedDate,
            tasks: [...Array.from(updatedState.tasks)]
        })
    })

    // Storing completed in different key
    const completedTasks = [...updatedState.completedTasks || []]
    chrome.storage.sync.set({
        'organizeyou_completed_tasks': JSON.stringify(completedTasks)
    })

    // Store settings separately too.
    chrome.storage.sync.set({
        'organizeyou_settings': JSON.stringify([...Array.from(updatedState.settings || new Map())])
    })
}

export function loadBrowserAppState(): Promise<BaseTasksState> {
    return getLocalStorageValue()
}

function getLocalStorageValue(): Promise<BaseTasksState> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get([
                'organizeyou_current_tasks',
                "organizeyou_completed_tasks",
                "organizeyou_settings"
            ], function (value) {
                if (value) {
                    const currentTasks = JSON.parse(value.organizeyou_current_tasks)
                    const completedTasks = JSON.parse(value.organizeyou_completed_tasks) || []
                    const settings = JSON.parse(value.organizeyou_settings) || []
                    const allTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[] | CompletedTask[]>(currentTasks.tasks)

                    const newAllTasks = migrateOverdueListToDateList(allTasks)

                    const migratedState = migrateCompletedListFromMap(new BaseTasksState(
                        // Load today by default.
                        getTodayKey(),
                        newAllTasks,
                        completedTasks,
                        new Map<SettingsType, boolean>(settings)
                        )
                    )

                    resolve(migratedState)
                } else {
                    resolve(emptyState())
                }
            })
        } catch (ex) {
            console.error(ex.message, ex)
            reject(ex);
        }
    });
}

export const clearBrowserState = () => {
    chrome.storage.sync.clear()
}