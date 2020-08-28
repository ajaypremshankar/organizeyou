import { TasksState } from "./tasks-state";
import { SettingsStateService } from "../settings/settings-state";
import { Task } from "../../types/types";
import { BucketUtils, TASK_STATE_ACTION } from "../bucket/bucket-utils";
import { wrapThrottle } from "../../utils/wrapper-utils";
import { AppStateService } from "./app-state-service";
import { hasBrowserStoragePermission } from "../../utils/platform-utils";


export class AppStateRepository {

    public static updateAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {
        if (hasBrowserStoragePermission()) {
            BrowserSyncStorageRepository.updateBrowserAppState(action, plannedOn, targetTask)
        } else {
            LocalStorageRepository.updateLocalAppState(action, plannedOn, targetTask)
        }
    }

    public static loadAppState = (): Promise<TasksState> => {
        if (hasBrowserStoragePermission()) {
            return BrowserSyncStorageRepository.loadBrowserAppState()
        } else {
            return LocalStorageRepository.loadLocalAppState()
        }
    }

    public static clearAppState = () => {
        if (hasBrowserStoragePermission()) {
            BrowserSyncStorageRepository.clearBrowserState()
        }
        LocalStorageRepository.clearLocalStorageState()
        SettingsStateService.clear()
    }

    public static initSyncStorageListener = () => {

        if (hasBrowserStoragePermission()) {
            chrome.storage.onChanged.addListener(wrapThrottle(function (changes: any, area: any) {
                if (area === "sync") {
                    AppStateService.loadState()
                }
            }, 1000));
        }
    }
}

class BrowserSyncStorageRepository {
    public static updateBrowserAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {
        chrome.storage.sync.get(null, function (currentSyncState) {

            let syncState: any = BucketUtils.getBucketedState(action, plannedOn, targetTask, currentSyncState)

            const toUpdate: any = {}
            const keysToDelete: string[] = []
            for (let key in syncState) {
                if (syncState[key].length > 0) {
                    toUpdate[key] = syncState[key]
                } else {
                    keysToDelete.push(key)
                }
            }

            if (syncState !== {}) {
                chrome.storage.sync.set(toUpdate)
            }

            if (keysToDelete.length > 0) {
                chrome.storage.sync.remove(keysToDelete)
            }
        })
    }

    public static loadBrowserAppState(): Promise<TasksState> {
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

    public static clearBrowserState = () => {
        chrome.storage.sync.clear()
    }
}

class LocalStorageRepository {
    private static getLocalStorageInObjectForm = (): any => {
        const data = Object.assign({}, localStorage)
        const persistedState: any = {}
        for (let key in data) {
            if (key.startsWith('oy_')) {
                persistedState[key] = JSON.parse(data[key])
            }
        }
        return persistedState;
    }

    public static updateLocalAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {

        const persistedState = LocalStorageRepository.getLocalStorageInObjectForm();

        let stateToUpdate: any = BucketUtils.getBucketedState(action, plannedOn, targetTask, persistedState)

        for (let key in stateToUpdate) {
            if (stateToUpdate[key].length > 0) {
                localStorage.setItem(key, JSON.stringify(stateToUpdate[key]))
            } else {
                localStorage.removeItem(key)
            }
        }
    }


    public static loadLocalAppState = (): Promise<TasksState> => {

        const persistedState = LocalStorageRepository.getLocalStorageInObjectForm();

        return new Promise((resolve, reject) => {
            resolve(BucketUtils.deserializeToBaseState(persistedState))
        })
    }

    public static clearLocalStorageState = () => {
        const data = Object.assign({}, localStorage)
        for (let key in data) {
            if (key.startsWith('oy_')) {
                localStorage.removeItem(key)
            }
        }
    }
}