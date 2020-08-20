import { CompletedTask, Task } from "../../types/types";
import { BaseTasksState } from "./base-tasks-state";
import { wrapThrottle } from "../../utils/wrapper-utils";
import { loadAppState } from "./app-state-facade-utils";
import { StateStore } from "./state-store";

export enum TASK_STATE_ACTION {
    ADD_UPDATE_TASK,
    MOVE_TASK,
    DELETE_TASK,
    COMPLETE_TASK,
    UNDO_COMPLETE_TASK,
}

export enum TASK_BUCKET_TYPE {
    ACTIVE_TASK = 'oy_at_',
    COMPLETED_TASK = 'oy_ct_',
}

export function loadBucketedState(): Promise<BaseTasksState> {
    return getBucketedSyncStorage()
}

function getBucketedSyncStorage(): Promise<BaseTasksState> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get(null, function (synState) {
                if (synState) {
                    let currentState: BaseTasksState = BaseTasksState.emptyState()

                    for (const syncKey in synState) {
                        if (syncKey.startsWith(TASK_BUCKET_TYPE.ACTIVE_TASK)) {
                            currentState = pushTasksIntoBucket(currentState, TASK_BUCKET_TYPE.ACTIVE_TASK, synState[syncKey])
                        } else if (syncKey.startsWith(TASK_BUCKET_TYPE.COMPLETED_TASK)) {
                            currentState = pushTasksIntoBucket(currentState, TASK_BUCKET_TYPE.COMPLETED_TASK, synState[syncKey])
                        }
                    }
                    resolve(currentState)
                } else {
                    resolve(BaseTasksState.emptyState())
                }
            })
        } catch (ex) {
            reject(ex);
        }
    });
}

export const updateBucketedSyncState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {

    chrome.storage.sync.get(null, function (currentSyncState) {
        if (currentSyncState) {

            let syncState: any = {}
            switch (action) {
                case TASK_STATE_ACTION.ADD_UPDATE_TASK:
                    let key = getTaskBucketKey(plannedOn, false)
                    let tasks = [...((currentSyncState[key] || []) as Task[])
                        .filter(t => t.id !== targetTask.id), targetTask]

                    syncState[key] = tasks
                    break;
                case TASK_STATE_ACTION.MOVE_TASK:
                    key = getTaskBucketKey(plannedOn, false)
                    const removedTasks = [...((currentSyncState[key] || []) as Task[])
                        .filter(t => t.id !== targetTask.id)]

                    const newBucketKey = getTaskBucketKey(targetTask.plannedOn, false)
                    let addedTasks = [...currentSyncState[newBucketKey] || [], targetTask]

                    syncState[key] = removedTasks
                    syncState[newBucketKey] = addedTasks
                    break;

                case TASK_STATE_ACTION.DELETE_TASK:
                    key = getTaskBucketKey(plannedOn, false)
                    tasks = [...((currentSyncState[key] || []) as Task[])
                        .filter(t => t.id !== targetTask.id)]

                    syncState[key] = tasks
                    break;

                case TASK_STATE_ACTION.COMPLETE_TASK:
                    key = getTaskBucketKey(plannedOn, false)
                    tasks = [...((currentSyncState[key] || []) as Task[])
                        .filter(t => t.id !== targetTask.id)]
                    const completedBucketKey = getTaskBucketKey(targetTask.plannedOn, true)
                    let completedTasks = [...currentSyncState[completedBucketKey] || [], targetTask]

                    //syncState[key] = tasks
                    syncState[completedBucketKey] = completedTasks
                    break;

                case TASK_STATE_ACTION.UNDO_COMPLETE_TASK:
                    key = getTaskBucketKey(plannedOn, true)
                    tasks = [...((currentSyncState[key] || []) as Task[])
                        .filter(t => t.id !== targetTask.id)]
                    const activeBucketKey = getTaskBucketKey(targetTask.plannedOn, false)
                    let activeTasks = [...currentSyncState[activeBucketKey] || [], targetTask]
                    syncState[key] = tasks
                    syncState[activeBucketKey] = activeTasks
            }

            if(syncState !== {}) {
                chrome.storage.sync.set(syncState)
            }
        }
    })
}

export const clearBucketedState = () => {
    chrome.storage.sync.clear()
}

/***
 * oy_at_<0> to oy_at_<99> = active tasks keys
 * oy_ct_<100> to oy_ct_<199> = completed tasks keys
 * @param plannedOn
 * @param complete
 */
const getTaskBucketKey = (plannedOn: number, complete: boolean) => {
    if (complete) {
        return `${TASK_BUCKET_TYPE.COMPLETED_TASK}${(plannedOn % 100) + 100}`
    } else {
        return `${TASK_BUCKET_TYPE.ACTIVE_TASK}${plannedOn % 100}`
    }
}

const pushTasksIntoBucket = (currentState: BaseTasksState, bucketType: TASK_BUCKET_TYPE, value: any[]): BaseTasksState => {
    if (!bucketType || !value) return currentState
    if (bucketType === TASK_BUCKET_TYPE.ACTIVE_TASK) {
        return currentState.addTasks(value)
    } else if (bucketType === TASK_BUCKET_TYPE.COMPLETED_TASK) {
        return BaseTasksState.newStateFrom(
            currentState.selectedDate,
            currentState.tasks,
            [...currentState.completedTasks, ...value as CompletedTask[]]
        )
    } else {
        return currentState
    }
}

export const initSyncStorageListener = () => {

    if (chrome && chrome.storage) {
        chrome.storage.onChanged.addListener(wrapThrottle(function (changes: any, area: any) {
            if (area === "sync") {
                loadAppState().then(value => {
                    StateStore.setToStore(value)
                })
            }
        }, 1000));
    }
}