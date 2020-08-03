import {BaseTasksState} from "../types/base-tasks-state";
import {loadBrowserAppState, updateBrowserAppState} from "./browser-app-state-utils";
import {loadLocalAppState, updateLocalAppState} from "./local-store-app-state-utils";
import { getTodayKey } from "./date-utils";
import { CompletedTask, Task } from "../types/types";

export const updateAppState = (updatedState: BaseTasksState) => {
    if(chrome && chrome.storage) {
        updateBrowserAppState(updatedState)
    } else {
        updateLocalAppState(updatedState)
    }
}

export const loadAppState = (): Promise<BaseTasksState> => {

    if(chrome && chrome.storage) {
        return loadBrowserAppState()
    } else {
        return loadLocalAppState()
    }
}

export const emptyState = (): BaseTasksState => {
    return new BaseTasksState(
        getTodayKey(),
        new Map<number, Task[] | CompletedTask[]>(),
        [],
        new Map()
    )
}