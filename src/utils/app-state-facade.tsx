import {BaseTasksState} from "../types/base-tasks-state";
import {loadBrowserAppState, updateBrowserAppState} from "./browser-app-state-utils";
import {loadLocalAppState, updateLocalAppState} from "./local-store-app-state-utils";

export const updateAppState = (updatedState: BaseTasksState) => {
    if(chrome && chrome.storage) {
        updateBrowserAppState(updatedState)
        console.log('saved to browser state')
    } else {
        updateLocalAppState(updatedState)
    }
}

export const loadAppState = (setBaseState: any) => {

    if(chrome && chrome.storage) {
        loadBrowserAppState(setBaseState)
    } else {
        loadLocalAppState(setBaseState)
    }
}