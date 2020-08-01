import {CompletedTask, SettingsType, Task} from "../types/types";
import {BaseTasksState} from "../types/base-tasks-state";
import {getTodayKey} from "./date-utils";

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

export function loadBrowserAppState(setBaseState: any) {
    getLocalStorageValue().then((val) =>{
        console.log('val')
        console.log(val)
        setBaseState(val)
    })
}

function getLocalStorageValue() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get('organizeyou', function (value) {
                console.log('fetched data')
                console.log(value)
                console.log(value.organizeyou)
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
                    resolve(new BaseTasksState(
                        getTodayKey(),
                        new Map<number, Task[] | CompletedTask[]>(),
                        new Map()
                    ))
                }
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}