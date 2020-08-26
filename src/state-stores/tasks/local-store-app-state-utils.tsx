import { BaseTasksState } from "./base-tasks-state";
import { Task } from "../../types/types";
import {
    BucketUtils,
    TASK_STATE_ACTION
} from "./bucket-utils";

const getLocalStorageInObjectForm = (): any => {
    const data = Object.assign({}, localStorage)
    const persistedState: any = {}
    for (let key in data) {
        if (key.startsWith('oy_')) {
            persistedState[key] = JSON.parse(data[key])
        }
    }
    return persistedState;
}

export const updateLocalAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {

    const persistedState = getLocalStorageInObjectForm();

    let stateToUpdate: any = BucketUtils.getBucketedState(action, plannedOn, targetTask, persistedState)

    for (let key in stateToUpdate) {
        localStorage.setItem(key, JSON.stringify(stateToUpdate[key]))
    }
}


export const loadLocalAppState = (): Promise<BaseTasksState> => {

    const persistedState = getLocalStorageInObjectForm();

    return new Promise((resolve, reject) => {
        resolve(BucketUtils.deserializeToBaseState(persistedState))
    })
}

export const clearLocalStorageState = () => {
    const data = Object.assign({}, localStorage)
    for (let key in data) {
        if (key.startsWith('oy_')) {
            localStorage.removeItem(key)
        }
    }
}