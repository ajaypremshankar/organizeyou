import { Task } from "../../types/types";
import { BaseTasksState } from "./base-tasks-state";
import {
    BucketUtils,
    TASK_STATE_ACTION
} from "./bucket-utils";

/***
 * Separated keys because of storage restrictions on a key
 * https://developer.chrome.com/apps/storage#type-StorageArea
 * @param updatedState
 */
export const updateBrowserAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {

    chrome.storage.sync.get(null, function (currentSyncState) {

        let syncState: any = BucketUtils.getBucketedState(action, plannedOn, targetTask, currentSyncState)

        if (syncState !== {}) {
            chrome.storage.sync.set(syncState)
        }
    })


}

export function loadBrowserAppState(): Promise<BaseTasksState> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(null, function (value) {
                resolve(BucketUtils.deserializeToBaseState(value))
            })
        } catch (ex) {
            reject(ex);
        }
    });
}

export const clearBrowserState = () => {
    chrome.storage.sync.clear()
}