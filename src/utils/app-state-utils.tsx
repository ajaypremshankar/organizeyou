import {CompletedTask, Task} from "../types/types";
import {BaseTasksState} from "../types/base-tasks-state";
import {getTodayKey} from "./date-utils";

export const updateAppState = (updatedState: BaseTasksState): BaseTasksState => {

    const state = {
         selectedDate: updatedState.selectedDate,
        tasks: [...Array.from(updatedState.tasks)]
    }

    localStorage.setItem("organizeyou-base-app-2", JSON.stringify(state))

    return new BaseTasksState(state.selectedDate, new Map<number, Task[]|CompletedTask[]>(state.tasks))
}


export const loadAppState = (): BaseTasksState => {

    const persistedState = localStorage.getItem("organizeyou-base-app-2");

    if(persistedState && !persistedState.includes('createdDate')) {
        const updatedState = migrateFromV200ToV210(persistedState)
        return new BaseTasksState(
            updatedState.selectedDate,
            new Map<number, Task[] | CompletedTask[]>(updatedState.tasks),
            true
        )
    } else if (persistedState) {
        const state = JSON.parse(persistedState)
        return new BaseTasksState(
            state.selectedDate,
            new Map<number, Task[] | CompletedTask[]>(state.tasks),
            true
        )
    } else {
        return new BaseTasksState(
            getTodayKey(),
            new Map<number, Task[] | CompletedTask[]>()
        )
    }
}


/***
 * Add createdDate and updatedDate to currently created tasks.
 * @param persistedState
 */
function migrateFromV200ToV210(persistedState: string) {
    const state = JSON.parse(persistedState)
    const now = new Date().getTime()

    const tasks = state.tasks.map((stateKeyValue: [number, any[]]) => {
        const taskArr = stateKeyValue[1].map(value => {
            if(!value.createdDate) {
                return {
                    ...value,
                    createdOn: now,
                    updatedOn: now
                }
            }
            return value
        })

        return [stateKeyValue[0], [...taskArr]]
    })

    return {
        ...state,
        tasks: tasks
    }
}