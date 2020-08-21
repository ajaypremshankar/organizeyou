import { BaseTasksState } from "./base-tasks-state";
import { Task } from "../../types/types";
import {
    deserializeBucketedToBaseState,
    getBucketedStateToUpdate,
    TASK_STATE_ACTION
} from "./bucketed-tasks-state-utils";

const getLocalStorageInObjectForm = (): any => {
    const data = Object.assign({}, localStorage)
    const persistedState: any = {}
    for (let key in data) {
        persistedState[key] = JSON.parse(data[key])
    }
    return persistedState;
}

export const updateLocalAppState = (action: TASK_STATE_ACTION, plannedOn: number, targetTask: Task) => {

    const persistedState = getLocalStorageInObjectForm();

    let stateToUpdate: any = getBucketedStateToUpdate(action, plannedOn, targetTask, persistedState)

    for (let key in stateToUpdate) {
        localStorage.setItem(key, JSON.stringify(stateToUpdate[key]))
    }
}


export const loadLocalAppState = (): Promise<BaseTasksState> => {

    const persistedState = getLocalStorageInObjectForm();

    return new Promise((resolve, reject) => {
        resolve(deserializeBucketedToBaseState(persistedState))
    })
}

export const clearLocalStorageState = () => {
    localStorage.removeItem("organizeyou-base-app-2")
}