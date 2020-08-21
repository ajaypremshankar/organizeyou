import { CompletedTask, Task } from "../../types/types";
import { BucketUtils, TASK_STATE_ACTION } from "./bucket-utils";
import { hasChromeStoragePermission } from "../../utils/platform-utils";
import { BaseTasksState } from "./base-tasks-state";
import { getTodayKey } from "../../utils/date-utils";
import { StateStore } from "./state-store";

const loadNonBucketedStorage = (): Promise<BaseTasksState> => {
    if (hasChromeStoragePermission()) {
        return getNonBucketedBrowserStorage()
    } else {
        return getNonBucketedLocalStorage()
    }
}
const getNonBucketedBrowserStorage = (): Promise<BaseTasksState> => {
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

                    resolve(BaseTasksState.newStateFrom(
                        // Load today by default.
                        getTodayKey(),
                        allTasks,
                        completedTasks
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

const getNonBucketedLocalStorage = (): Promise<BaseTasksState> => {
    const persistedState = localStorage.getItem("organizeyou-base-app-2");

    if (!persistedState) {
        return new Promise((resolve, reject) => {
            resolve(undefined)
        })
    }

    const updatedState = JSON.parse(persistedState)
    const loadedLocalBaseState = BaseTasksState.newStateFrom(
        // Load today by default
        getTodayKey(),
        new Map<number, Task[]>(updatedState.tasks),
        updatedState.completedTasks,
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
            if (hasChromeStoragePermission()) {
                chrome.storage.sync.clear(() => {
                    // Once clear, persist new state
                    chrome.storage.sync.set(bucketedData)
                    StateStore.loadState()
                })
            } else {
                localStorage.removeItem('organizeyou-base-app-2')
                // Once clear, persist new state
                for (let key in bucketedData) {
                    localStorage.setItem(key, JSON.stringify(bucketedData[key]))
                }
                StateStore.loadState()
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
            const completedTasks = [...syncState[completedBucketKey] || [], targetTask]
            syncState[completedBucketKey] = completedTasks
            break;
    }
}
