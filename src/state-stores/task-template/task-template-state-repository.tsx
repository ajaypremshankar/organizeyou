import { TaskTemplate } from "../../types/types";
import { hasBrowserStoragePermission } from "../../utils/platform-utils";
import { TaskTemplateState } from "./task-template-state";

export enum TASK_TEMPLATE_STATE_ACTION {
    ADD_UPDATE,
    DELETE,
}

export class TaskTemplateStateRepository {

    public static update = (action: TASK_TEMPLATE_STATE_ACTION, data: TaskTemplate) => {
        if (hasBrowserStoragePermission()) {
            BrowserSyncStorageRepository.update(action, data)
        } else {
            LocalStorageRepository.updateLocalAppState(action, data)
        }
    }

    public static loadAppState = (): Promise<TaskTemplateState> => {
        if (hasBrowserStoragePermission()) {
            return BrowserSyncStorageRepository.loadBrowserAppState()
        } else {
            return LocalStorageRepository.loadLocalState()
        }
    }

    public static clearAppState = () => {
        if (hasBrowserStoragePermission()) {
            BrowserSyncStorageRepository.clearBrowserState()
        }
        LocalStorageRepository.clearLocalStorageState()
    }

}

class BrowserSyncStorageRepository {
    public static update = (action: TASK_TEMPLATE_STATE_ACTION, data: TaskTemplate) => {
        chrome.storage.sync.get(null, function (currentSyncState) {

            let syncState: any = BucketUtils.getBucketedState(action, data, currentSyncState)

            const toUpdate: any = {}
            const keysToDelete: string[] = []
            for (let key in syncState) {
                const uniqueValues = Array.from(new Set(syncState[key]))
                if (uniqueValues.length > 0) {
                    toUpdate[key] = uniqueValues
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

    public static loadBrowserAppState(): Promise<TaskTemplateState> {
        return new Promise((resolve, reject) => {
            try {
                chrome.storage.sync.get(null, function (value) {
                    resolve(BucketUtils.deserializeToTaskTemplateState(value))
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

    public static updateLocalAppState = (action: TASK_TEMPLATE_STATE_ACTION, data: TaskTemplate) => {

        const persistedState = LocalStorageRepository.getLocalStorageInObjectForm();

        let stateToUpdate: any = BucketUtils.getBucketedState(action, data, persistedState)

        for (let key in stateToUpdate) {
            const uniqueValues = Array.from(new Set(stateToUpdate[key]))
            if (uniqueValues.length > 0) {
                localStorage.setItem(key, JSON.stringify(uniqueValues))
            } else {
                localStorage.removeItem(key)
            }
        }
    }


    public static loadLocalState = (): Promise<TaskTemplateState> => {

        const persistedState = LocalStorageRepository.getLocalStorageInObjectForm();

        return new Promise((resolve, reject) => {
            resolve(BucketUtils.deserializeToTaskTemplateState(persistedState))
        })
    }

    public static clearLocalStorageState = () => {
        const data = Object.assign({}, localStorage)
        for (let key in data) {
            if (key.startsWith('oy_tt_')) {
                localStorage.removeItem(key)
            }
        }
    }
}

class BucketUtils {
    public static getBucketedState = (action: TASK_TEMPLATE_STATE_ACTION, data: TaskTemplate, currentStorageData: any): any => {
        let syncState: any = {}

        if (!data) {
            return syncState
        }

        if (!currentStorageData) {
            currentStorageData = {}
        }

        switch (action) {
            case TASK_TEMPLATE_STATE_ACTION.ADD_UPDATE:
                const addOrUpdateKey = BucketUtils.getBucketKey(data.id)
                const addOrUpdateTasks = [...((currentStorageData[addOrUpdateKey] || []) as TaskTemplate[])
                    .filter(t => t.id !== data.id), data]

                syncState[addOrUpdateKey] = addOrUpdateTasks
                break;

            case TASK_TEMPLATE_STATE_ACTION.DELETE:
                const deleteKey = BucketUtils.getBucketKey(data.id)
                const tasksAfterDelete = [...((currentStorageData[deleteKey] || []) as TaskTemplate[])
                    .filter(t => t.id !== data.id)]

                syncState[deleteKey] = tasksAfterDelete
                break;
        }

        return syncState
    }

    public static deserializeToTaskTemplateState = (storageData: any): any => {
        if (storageData) {
            let taskTemplateState: TaskTemplateState = TaskTemplateState.emptyState();
            for (const storageKey in storageData) {
                if (storageKey.startsWith('oy_tt_')) {
                    taskTemplateState.addOrUpdateTemplates(storageData[storageKey])
                }
            }
            return taskTemplateState
        }

        return TaskTemplateState.emptyState()
    }

    public static getBucketKey = (id: number) => {
        return `oy_tt_${id % 100}`
    }
}