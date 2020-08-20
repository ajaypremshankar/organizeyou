import { CompletedTask, Task } from "../../types/types";
import { BaseTasksState } from "./base-tasks-state";
import { getTodayKey } from "../../utils/date-utils";

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
}

export function loadBrowserAppState(): Promise<BaseTasksState> {
    return getBrowserStorageValue()
}

function getBrowserStorageValue(): Promise<BaseTasksState> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get([
                'organizeyou_current_tasks',
                "organizeyou_completed_tasks"
            ], function (value) {
                if (value) {
                    const currentTasks = JSON.parse(value['organizeyou_current_tasks'])
                    const completedTasks = JSON.parse(value['organizeyou_completed_tasks']) || []
                    const allTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[] | CompletedTask[]>(currentTasks.tasks)

                    resolve(BaseTasksState.newStateFrom(
                        // Load today by default.
                        getTodayKey(),
                        allTasks,
                        completedTasks
                        )
                    )
                } else {
                    resolve(BaseTasksState.emptyState())
                }
            })
        } catch (ex) {
            reject(ex);
        }
    });
}

export const clearBrowserState = () => {
    chrome.storage.sync.clear()
}