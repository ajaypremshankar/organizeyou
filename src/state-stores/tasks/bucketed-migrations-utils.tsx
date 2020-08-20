import { Task } from "../../types/types";
import { TASK_BUCKET_TYPE, TASK_STATE_ACTION } from "./bucketed-tasks-state-utils";
import { clearBrowserState, loadBrowserAppState } from "./browser-app-state-utils";
import { isExtension } from "../../utils/platform-utils";

export const migrateToBucketedKeySupport = () => {
    if (!isExtension()) {
        return;
    }

    const syncState: any = {}
    //transform from old to new state
    loadBrowserAppState().then(state => {
        state.tasks.forEach((tasks, key) => {
            (tasks || []).forEach(task => {
                getMigratedSyncState(syncState, TASK_STATE_ACTION.ADD_UPDATE_TASK, task.plannedOn, task)
            })
        });

        (state.completedTasks || []).forEach(completedTask => {
            getMigratedSyncState(syncState, TASK_STATE_ACTION.COMPLETE_TASK, completedTask.plannedOn, completedTask)
        })

        // clear old state
        clearBrowserState()

        // persist new state
        if(syncState !== {}) {
            chrome.storage.sync.set(syncState)
        }

    })
}

const getMigratedSyncState = (syncState: any, action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {

    switch (action) {
        // Add to active tasks bucket
        case TASK_STATE_ACTION.ADD_UPDATE_TASK:
            const key = getTaskBucketKey(plannedOn, false)
            const tasks = [...(syncState[key] || []), targetTask]
            syncState[key] = tasks
            break;

        // Add to completed tasks bucket
        case TASK_STATE_ACTION.COMPLETE_TASK:
            const completedBucketKey = getTaskBucketKey(targetTask.plannedOn, true)
            const completedTasks = [...syncState[completedBucketKey] || [], targetTask]
            syncState[completedBucketKey] = completedTasks
            break;
    }
}

const getTaskBucketKey = (plannedOn: number, complete: boolean) => {
    if (complete) {
        return `${TASK_BUCKET_TYPE.COMPLETED_TASK}${(plannedOn % 100) + 100}`
    } else {
        return `${TASK_BUCKET_TYPE.ACTIVE_TASK}${plannedOn % 100}`
    }
};