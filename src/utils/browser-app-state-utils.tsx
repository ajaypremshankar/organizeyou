import {CompletedTask, SettingsType, Task} from "../types/types";
import {BaseTasksState} from "../types/base-tasks-state";
import { emptyState } from "./app-state-facade-utils";

export const updateBrowserAppState = (updatedState: BaseTasksState) => {

    const state = {
        selectedDate: updatedState.selectedDate,
        tasks: [...Array.from(updatedState.tasks)],
        settings: [...Array.from(updatedState.settings || new Map())]
    }

    chrome.storage.sync.set({
        'organizeyou': JSON.stringify(state)
    })
}

export function loadBrowserAppState(): Promise<BaseTasksState> {
    return getLocalStorageValue()
}

function getLocalStorageValue(): Promise<BaseTasksState> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get('organizeyou', function (value) {
                if (value.organizeyou) {
                    const appData = JSON.parse(value.organizeyou)
                    resolve(new BaseTasksState(
                        appData.selectedDate,
                        new Map<number, Task[] | CompletedTask[]>(appData.tasks),
                        appData.settings ? new Map<SettingsType, boolean>(appData.settings) : new Map(),
                        true
                        )
                    )
                } else {
                    resolve(emptyState())
                }
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}