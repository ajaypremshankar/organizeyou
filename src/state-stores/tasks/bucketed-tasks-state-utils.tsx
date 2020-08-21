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

export function deserializeBucketedToBaseState(storageData: any): any {
    if (storageData) {
        let baseState: BaseTasksState = BaseTasksState.emptyState()
        for (const storageKey in storageData) {
            if (storageKey.startsWith(TASK_BUCKET_TYPE.ACTIVE_TASK)) {
                baseState = pushTasksIntoBucket(baseState, TASK_BUCKET_TYPE.ACTIVE_TASK, storageData[storageKey])
            } else if (storageKey.startsWith(TASK_BUCKET_TYPE.COMPLETED_TASK)) {
                baseState = pushTasksIntoBucket(baseState, TASK_BUCKET_TYPE.COMPLETED_TASK, storageData[storageKey])
            }
        }
        return baseState
    }

    return BaseTasksState.emptyState()
}

export const getBucketedStateToUpdate = (action: TASK_STATE_ACTION, plannedOn: number,
                                         targetTask: Task, currentStorageData: any): any => {
    let syncState: any = {}

    if (currentStorageData) {

        switch (action) {
            case TASK_STATE_ACTION.ADD_UPDATE_TASK:
                const addOrUpdateKey = getTaskBucketKey(plannedOn, false)
                const addOrUpdateTasks = [...((currentStorageData[addOrUpdateKey] || []) as Task[])
                    .filter(t => t.id !== targetTask.id), targetTask]

                syncState[addOrUpdateKey] = addOrUpdateTasks
                break;
            case TASK_STATE_ACTION.MOVE_TASK:
                const moveKey = getTaskBucketKey(plannedOn, false)
                const removedTasks = [...((currentStorageData[moveKey] || []) as Task[])
                    .filter(t => t.id !== targetTask.id)]

                const newBucketKey = getTaskBucketKey(targetTask.plannedOn, false)
                let addedTasks = [...currentStorageData[newBucketKey] || [], targetTask]

                syncState[moveKey] = removedTasks
                syncState[newBucketKey] = addedTasks
                break;

            case TASK_STATE_ACTION.DELETE_TASK:
                const deleteKey = getTaskBucketKey(plannedOn, false)
                const tasksAfterDelete = [...((currentStorageData[deleteKey] || []) as Task[])
                    .filter(t => t.id !== targetTask.id)]

                syncState[deleteKey] = tasksAfterDelete
                break;

            case TASK_STATE_ACTION.COMPLETE_TASK:
                const toCompleteKey = getTaskBucketKey(plannedOn, false)
                const newActiveTasks = [...((currentStorageData[toCompleteKey] || []) as Task[])
                    .filter(t => t.id !== targetTask.id)]
                const completedBucketKey = getTaskBucketKey(targetTask.plannedOn, true)
                let completedTasks = [...currentStorageData[completedBucketKey] || [], targetTask]

                syncState[toCompleteKey] = newActiveTasks
                syncState[completedBucketKey] = completedTasks
                break;

            case TASK_STATE_ACTION.UNDO_COMPLETE_TASK:
                const currentlyCompleteKey = getTaskBucketKey(plannedOn, true)
                const newCompleteTasks = [...((currentStorageData[currentlyCompleteKey] || []) as Task[])
                    .filter(t => t.id !== targetTask.id)]
                const activeBucketKey = getTaskBucketKey(targetTask.plannedOn, false)
                let activeTasks = [...currentStorageData[activeBucketKey] || [], targetTask]
                syncState[currentlyCompleteKey] = newCompleteTasks
                syncState[activeBucketKey] = activeTasks
        }
    }

    return syncState
}

/***
 * oy_at_<0> to oy_at_<99> = active tasks keys
 * oy_ct_<0> to oy_ct_<99> = completed tasks keys
 * @param plannedOn
 * @param complete
 */
export const getTaskBucketKey = (plannedOn: number, complete: boolean) => {

    const lastThreeDigitsReversed = (plannedOn % 1000).toString().split("").reverse().join("")
    const bucket = Number(lastThreeDigitsReversed) % 100;

    if (complete) {
        return `${TASK_BUCKET_TYPE.COMPLETED_TASK}${bucket}`
    } else {
        return `${TASK_BUCKET_TYPE.ACTIVE_TASK}${bucket}`
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