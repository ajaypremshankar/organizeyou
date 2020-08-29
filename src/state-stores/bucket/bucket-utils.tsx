import { CompletedTask, HashTagTaskMapping, Task } from "../../types/types";
import { TasksState } from "../tasks/tasks-state";

export enum TASK_STATE_ACTION {
    ADD_UPDATE_TASK,
    MOVE_TASK,
    DELETE_TASK,
    COMPLETE_TASK,
    UNDO_COMPLETE_TASK,
    DELETE_COMPLETED_TASK,
}

export enum TASK_BUCKET_TYPE {
    ACTIVE_TASK = 'oy_at_',
    COMPLETED_TASK = 'oy_ct_',
    HASH_TAGS = 'oy_ht_'
}

export class BucketUtils {
    public static deserializeToBaseState = (storageData: any): any => {
        if (storageData) {
            let baseState: TasksState = TasksState.emptyState()
            for (const storageKey in storageData) {
                if (storageKey.startsWith(TASK_BUCKET_TYPE.ACTIVE_TASK)) {
                    baseState = BucketUtils.pushBucketedTasksToBaseState(baseState, TASK_BUCKET_TYPE.ACTIVE_TASK, storageData[storageKey])
                } else if (storageKey.startsWith(TASK_BUCKET_TYPE.COMPLETED_TASK)) {
                    baseState = BucketUtils.pushBucketedTasksToBaseState(baseState, TASK_BUCKET_TYPE.COMPLETED_TASK, storageData[storageKey])
                } else if (storageKey.startsWith(TASK_BUCKET_TYPE.HASH_TAGS)) {
                    baseState = BucketUtils.pushBucketedTasksToBaseState(baseState, TASK_BUCKET_TYPE.HASH_TAGS, storageData[storageKey])
                }
            }
            return baseState
        }

        return TasksState.emptyState()
    }

    public static getBucketedState = (action: TASK_STATE_ACTION, plannedOn: number,
                                      targetTask: Task | CompletedTask, currentStorageData: any): any => {
        let syncState: any = {}

        if (plannedOn <= 0 || !targetTask) {
            return syncState
        }

        if (!currentStorageData) {
            currentStorageData = {}
        }

        switch (action) {
            case TASK_STATE_ACTION.ADD_UPDATE_TASK:
                const addOrUpdateKey = BucketUtils.getBucketKey(plannedOn, false)
                const addOrUpdateTasks = [...((currentStorageData[addOrUpdateKey] || []) as Task[])
                    .filter(t => t.id !== targetTask.id), targetTask]

                syncState[addOrUpdateKey] = addOrUpdateTasks
                break;
            case TASK_STATE_ACTION.MOVE_TASK:
                const moveKey = BucketUtils.getBucketKey(plannedOn, false)
                const newBucketKey = BucketUtils.getBucketKey(targetTask.plannedOn, false)

                if (moveKey !== newBucketKey) {
                    const removedTasks = [...((currentStorageData[moveKey] || []) as Task[])
                        .filter(t => t.id !== targetTask.id)]
                    const addedTasks = [...(currentStorageData[newBucketKey] || []), targetTask]

                    syncState[moveKey] = removedTasks
                    syncState[newBucketKey] = addedTasks
                } else {
                    const updatedTasks = [...((currentStorageData[moveKey] || []) as Task[])
                        .filter(t => t.id !== targetTask.id), targetTask]

                    syncState[moveKey] = updatedTasks
                }
                break;

            case TASK_STATE_ACTION.DELETE_TASK:
                const deleteKey = BucketUtils.getBucketKey(plannedOn, false)
                const tasksAfterDelete = [...((currentStorageData[deleteKey] || []) as Task[])
                    .filter(t => t.id !== targetTask.id)]

                syncState[deleteKey] = tasksAfterDelete
                break;

            case TASK_STATE_ACTION.COMPLETE_TASK:
                const toCompleteKey = BucketUtils.getBucketKey(plannedOn, false)
                const newActiveTasks = [...((currentStorageData[toCompleteKey] || []) as Task[])
                    .filter(t => t.id !== targetTask.id)]
                const completedBucketKey = BucketUtils.getBucketKey(targetTask.plannedOn, true)
                let completedTasks = [...(currentStorageData[completedBucketKey] || []), targetTask]

                syncState[toCompleteKey] = newActiveTasks
                syncState[completedBucketKey] = completedTasks
                break;

            case TASK_STATE_ACTION.UNDO_COMPLETE_TASK:
                const currentlyCompleteKey = BucketUtils.getBucketKey(plannedOn, true)
                const newCompleteTasks = [...((currentStorageData[currentlyCompleteKey] || []) as CompletedTask[])
                    .filter(t => t.id !== targetTask.id)]
                const activeBucketKey = BucketUtils.getBucketKey(targetTask.plannedOn, false)
                let activeTasks = [...(currentStorageData[activeBucketKey] || []), targetTask]
                syncState[currentlyCompleteKey] = newCompleteTasks
                syncState[activeBucketKey] = activeTasks
                break;
            case TASK_STATE_ACTION.DELETE_COMPLETED_TASK:
                const toBeDeletedCompleteKey = BucketUtils.getBucketKey(targetTask.plannedOn, true)
                const postDeleteCompleteTasks = [...((currentStorageData[toBeDeletedCompleteKey] || []) as CompletedTask[])
                    .filter(t => t.id !== targetTask.id)]
                syncState[toBeDeletedCompleteKey] = postDeleteCompleteTasks
        }

        return syncState
    }

    public static getHashTagBuckets = (deltaTagsMap: Map<string, HashTagTaskMapping[]>): any => {
        let syncState: any = {}

        deltaTagsMap.forEach((value, key) => {
            syncState[`${TASK_BUCKET_TYPE.HASH_TAGS}${key}`] = value
        })

        return syncState
    }

    /***
     * oy_at_<0> to oy_at_<99> = active tasks keys
     * oy_ct_<0> to oy_ct_<99> = completed tasks keys
     * @param plannedOn
     * @param complete
     */
    public static getBucketKey = (plannedOn: number, complete: boolean) => {

        const lastThreeDigitsReversed = (plannedOn % 1000).toString().split("").reverse().join("")
        const bucket = Number(lastThreeDigitsReversed) % 100;

        if (complete) {
            return `${TASK_BUCKET_TYPE.COMPLETED_TASK}${bucket}`
        } else {
            return `${TASK_BUCKET_TYPE.ACTIVE_TASK}${bucket}`
        }
    }

    /***
     * While deserializing we push task either into tasks map or completed list array
     * @param currentState
     * @param bucketType
     * @param bucketedValue
     */
    private static pushBucketedTasksToBaseState = (currentState: TasksState,
                                                   bucketType: TASK_BUCKET_TYPE, bucketedValue: any[]): TasksState => {
        if (!bucketType || !bucketedValue) return currentState
        if (bucketType === TASK_BUCKET_TYPE.ACTIVE_TASK) {
            return currentState.addTasks(bucketedValue)
        } else if (bucketType === TASK_BUCKET_TYPE.COMPLETED_TASK) {
            return TasksState.newStateFrom(
                currentState.selectedDate,
                currentState.selectedList,
                currentState.tasks,
                [...currentState.completedTasks, ...bucketedValue as CompletedTask[]],
                new Map<string, HashTagTaskMapping[]>(currentState.hashTags)
            )
        } else if (bucketType === TASK_BUCKET_TYPE.HASH_TAGS) {
            return currentState.addHashTags(bucketedValue)
        } else {
            return currentState
        }
    }
}