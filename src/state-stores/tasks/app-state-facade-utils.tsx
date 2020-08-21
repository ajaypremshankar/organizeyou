import { BaseTasksState } from "./base-tasks-state";

import { clearLocalStorageState, loadLocalAppState, updateLocalAppState } from "./local-store-app-state-utils";
import { SettingsStateStore } from "../settings/settings-state";
import { Task } from "../../types/types";
import { clearBrowserState, loadBrowserAppState, updateBrowserAppState } from "./browser-app-state-utils";
import { TASK_STATE_ACTION } from "./bucket-utils";
import { wrapThrottle } from "../../utils/wrapper-utils";
import { StateStore } from "./state-store";
import { hasChromeStoragePermission } from "../../utils/platform-utils";

export const updateAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {
    if (hasChromeStoragePermission()) {
        updateBrowserAppState(action, plannedOn, targetTask)
    } else {
        updateLocalAppState(action, plannedOn, targetTask)
    }
}

export const loadAppState = (): Promise<BaseTasksState> => {
    if (hasChromeStoragePermission()) {
        return loadBrowserAppState()
    } else {
        return loadLocalAppState()
    }
}

export const clearAppState = () => {
    if (hasChromeStoragePermission()) {
        clearBrowserState()
    }
    clearLocalStorageState()
    SettingsStateStore.clear()
}

export const initSyncStorageListener = () => {

    if (hasChromeStoragePermission()) {
        chrome.storage.onChanged.addListener(wrapThrottle(function (changes: any, area: any) {
            if (area === "sync") {
                StateStore.loadState()
            }
        }, 1000));
    }
}