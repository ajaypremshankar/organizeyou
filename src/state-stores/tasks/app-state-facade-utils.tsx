import { BaseTasksState } from "./base-tasks-state";

import { clearLocalStorageState, loadLocalAppState, updateLocalAppState } from "./local-store-app-state-utils";
import { SettingsStateStore } from "../settings/settings-state";
import { Task } from "../../types/types";
import { clearBrowserState, loadBrowserAppState, updateBrowserAppState } from "./browser-app-state-utils";
import { TASK_STATE_ACTION } from "./bucketed-tasks-state-utils";

export const updateAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task, updatedState: BaseTasksState) => {
    if (chrome && chrome.storage) {
        updateBrowserAppState(action, plannedOn, targetTask)
    } else {
        updateLocalAppState(action, plannedOn, targetTask)
    }
}

export const loadAppState = (): Promise<BaseTasksState> => {
    if (chrome && chrome.storage) {
        return loadBrowserAppState()
    } else {
        return loadLocalAppState()
    }
}

export const clearAppState = () => {
    if (chrome && chrome.storage) {
        clearBrowserState()
    }
    clearLocalStorageState()
    SettingsStateStore.clear()
}
