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

    if (persistedState) {
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