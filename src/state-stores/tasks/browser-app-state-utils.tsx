import { Task } from "../../types/types";
import { BaseTasksState } from "./base-tasks-state";
import {
    deserializeBucketedToBaseState,
    getBucketedStateToUpdate,
    TASK_STATE_ACTION
} from "./bucketed-tasks-state-utils";

/***
 * Separated keys because of storage restrictions on a key
 * https://developer.chrome.com/apps/storage#type-StorageArea
 * @param updatedState
 */
export const updateBrowserAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {

    chrome.storage.sync.get(null, function (currentSyncState) {

        let syncState: any = getBucketedStateToUpdate(action, plannedOn, targetTask, currentSyncState)

        if (syncState !== {}) {
            chrome.storage.sync.set(syncState)
        }
    })


}

export function loadBrowserAppState(): Promise<BaseTasksState> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(null, function (value) {
                resolve(deserializeBucketedToBaseState(value))
            })
        } catch (ex) {
            reject(ex);
        }
    });
}

export const clearBrowserState = () => {
    chrome.storage.sync.clear()
}