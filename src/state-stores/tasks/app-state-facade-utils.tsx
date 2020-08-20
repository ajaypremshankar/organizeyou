import { BaseTasksState } from "./base-tasks-state";
import {
    clearBucketedState,
    loadBucketedState,
    TASK_STATE_ACTION,
    updateBucketedSyncState
} from "./bucketed-tasks-state-utils";
import { clearLocalStorageState, loadLocalAppState, updateLocalAppState } from "./local-store-app-state-utils";
import { SettingsStateStore } from "../settings/settings-state";
import { Task } from "../../types/types";

export const updateAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task, updatedState: BaseTasksState) => {
    if (chrome && chrome.storage) {
        updateBucketedSyncState(action, plannedOn, targetTask)
    } else {
        updateLocalAppState(updatedState)
    }
}

export const loadAppState = (): Promise<BaseTasksState> => {
    if (chrome && chrome.storage) {
        return loadBucketedState()
    } else {
        return loadLocalAppState()
    }
}

export const clearLocalState = () => {
    if (chrome && chrome.storage) {
        clearBucketedState()
    }
    clearLocalStorageState()
    SettingsStateStore.clear()
}
