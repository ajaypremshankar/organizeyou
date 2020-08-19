import { BaseTasksState } from "../types/base-tasks-state";
import { clearBrowserState, loadBrowserAppState, updateBrowserAppState } from "./browser-app-state-utils";
import { clearLocalStorageState, loadLocalAppState, updateLocalAppState } from "./local-store-app-state-utils";
import { SettingsStateStore } from "../types/settings-state";

export const updateAppState = (updatedState: BaseTasksState) => {
    if (chrome && chrome.storage) {
        updateBrowserAppState(updatedState)
    } else {
        updateLocalAppState(updatedState)
    }
}

export const loadAppState = (): Promise<BaseTasksState> => {
    if (chrome && chrome.storage) {
        return loadBrowserAppState()
    } else {
        return loadLocalAppState()
    }
}

export const clearLocalState = () => {
    if (chrome && chrome.storage) {
        clearBrowserState()
    }
    clearLocalStorageState()
    SettingsStateStore.clear()
}
