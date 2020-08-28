import { CompletedTask, HashTagTaskMapping, Task } from "../../types/types";
import { BucketUtils, TASK_STATE_ACTION } from "./bucket-utils";
import { hasBrowserStoragePermission } from "../../utils/platform-utils";
import { TasksState } from "../tasks/tasks-state";
import { getTodayKey } from "../../utils/date-utils";
import { AppStateService } from "../tasks/app-state-service";
import { KeyTitleUtils } from "../../utils/key-title-utils";

const loadNonBucketedStorage = (): Promise<TasksState> => {
    if (hasBrowserStoragePermission()) {
        return getNonBucketedBrowserStorage()
    } else {
        return getNonBucketedLocalStorage()
    }
}
const getNonBucketedBrowserStorage = (): Promise<TasksState> => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get([
                'organizeyou_current_tasks',
                'organizeyou_completed_tasks'
            ], function (value) {
                if (value &&
                    ('organizeyou_current_tasks' in value ||
                        'organizeyou_completed_tasks' in value)
                ) {
                    const currentTasks = JSON.parse(value['organizeyou_current_tasks'] || '[]')
                    const completedTasks = JSON.parse(value['organizeyou_completed_tasks'] || '[]')
                    const allTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[] | CompletedTask[]>(currentTasks.tasks)

                    resolve(TasksState.newStateFrom(
                        // Load today by default.
                        getTodayKey(),
                        "",
                        allTasks,
                        completedTasks,
                        new Map<string, HashTagTaskMapping[]>()
                        )
                    )
                } else {
                    resolve(undefined)
                }
            })
        } catch (ex) {
            reject(ex);
        }
    });
}

const getNonBucketedLocalStorage = (): Promise<TasksState> => {
    const persistedState = localStorage.getItem("organizeyou-base-app-2");

    if (!persistedState) {
        return new Promise((resolve, reject) => {
            resolve(undefined)
        })
    }

    const updatedState = JSON.parse(persistedState)
    const loadedLocalBaseState = TasksState.newStateFrom(
        // Load today by default
        getTodayKey(),
        "",
        new Map<number, Task[]>(updatedState.tasks),
        updatedState.completedTasks,
        new Map<string, HashTagTaskMapping[]>()
    )

    return new Promise((resolve, reject) => {
        resolve(loadedLocalBaseState)
    })
}

export const migrateToBucketedKeySupport = () => {

    const bucketedData: any = {}
    //transform from old to new state
    loadNonBucketedStorage().then(state => {
        if (!state) return

        state.tasks.forEach((tasks, key) => {
            (tasks || []).forEach(task => {
                getMigratedSyncState(bucketedData, TASK_STATE_ACTION.ADD_UPDATE_TASK, task.plannedOn, task)
            })
        });

        (state.completedTasks || []).forEach(completedTask => {
            getMigratedSyncState(bucketedData, TASK_STATE_ACTION.COMPLETE_TASK, completedTask.plannedOn, completedTask)
        })

        // clear old state
        if (bucketedData !== {}) {
            if (hasBrowserStoragePermission()) {
                chrome.storage.sync.clear(() => {
                    // Once clear, persist new state
                    chrome.storage.sync.set(bucketedData)
                    AppStateService.loadState()
                })
            } else {
                localStorage.removeItem('organizeyou-base-app-2')
                // Once clear, persist new state
                for (let key in bucketedData) {
                    localStorage.setItem(key, JSON.stringify(bucketedData[key]))
                }
                AppStateService.loadState()
            }
        }
    })
}

const getMigratedSyncState = (syncState: any, action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {

    switch (action) {
        // Add to active tasks bucket
        case TASK_STATE_ACTION.ADD_UPDATE_TASK:
            const key = BucketUtils.getBucketKey(plannedOn, false)
            const tasks = [...(syncState[key] || []), targetTask]
            syncState[key] = tasks
            break;

        // Add to completed tasks bucket
        case TASK_STATE_ACTION.COMPLETE_TASK:
            const completedBucketKey = BucketUtils.getBucketKey(targetTask.plannedOn, true)
            const completedTasks = [...(syncState[completedBucketKey] || []), targetTask]
            syncState[completedBucketKey] = completedTasks
            break;
    }
}
