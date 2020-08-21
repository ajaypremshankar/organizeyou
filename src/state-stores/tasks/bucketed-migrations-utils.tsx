import { CompletedTask, Task } from "../../types/types";
import { getTaskBucketKey, TASK_STATE_ACTION } from "./bucketed-tasks-state-utils";
import { isExtension } from "../../utils/platform-utils";
import { BaseTasksState } from "./base-tasks-state";
import { getTodayKey } from "../../utils/date-utils";
import { StateStore } from "./state-store";

function getNonBucketedBrowserStorage(): Promise<BaseTasksState> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get([
                'organizeyou_current_tasks',
                "organizeyou_completed_tasks"
            ], function (value) {
                if (value) {
                    const currentTasks = JSON.parse(value['organizeyou_current_tasks'] || '{}')
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
                    resolve(BaseTasksState.emptyState())
                }
            })
        } catch (ex) {
            reject(ex);
        }
    });
}

export const migrateToBucketedKeySupport = () => {
    if (!isExtension()) {
        return;
    }

    const syncState: any = {}
    //transform from old to new state
    getNonBucketedBrowserStorage().then(state => {
        state.tasks.forEach((tasks, key) => {
            (tasks || []).forEach(task => {
                getMigratedSyncState(syncState, TASK_STATE_ACTION.ADD_UPDATE_TASK, task.plannedOn, task)
            })
        });

        (state.completedTasks || []).forEach(completedTask => {
            getMigratedSyncState(syncState, TASK_STATE_ACTION.COMPLETE_TASK, completedTask.plannedOn, completedTask)
        })

        // clear old state
        chrome.storage.sync.clear(() => {
            console.log(syncState)
            // Once clear, persist new state
            if(syncState !== {}) {
                chrome.storage.sync.set(syncState)
                StateStore.loadState()
            }
        })
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
