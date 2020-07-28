import {RootDataStore, Task} from "../types/types";
import {getToday, parseFromDDMMyyyy} from "./date-utils";

export const initOrRefreshAppStateData = (): RootDataStore => {
    const appData: RootDataStore = deserializeAppState();

    serializeAppState({
        ...computeOverdueTaskList(appData)
    })

    return deserializeAppState()
}

export const serializeAppState = (updatedState: RootDataStore) => {

    const currentState = deserializeAppState();
    const state = {
        ...currentState,
        ...updatedState,
        tasks: JSON.stringify(Array.from(updatedState.tasks.entries()))
    }

    localStorage.setItem("organizeyou-base-app", JSON.stringify(state))
}


export const deserializeAppState = (): RootDataStore => {

    const persistedState = localStorage.getItem("organizeyou-base-app");

    if (persistedState) {
        const state = JSON.parse(persistedState)
        return {
            ...state,
            tasks: new Map(JSON.parse(state.tasks)),
            completedTasks: state.completedTasks.map((ct: any) => {
                return {
                    id: ct.id,
                    value: ct.value,
                    plannedDate: ct.plannedDate,
                    completedDate: new Date(ct.completedDate)
                }
            })
        }
    } else {
        return {
            currentlySelectedDate: getToday(),
            tasks: new Map<string, Task[]>(),
            completedTasks: []
        }
    }
}

const computeOverdueTaskList = (appData: RootDataStore): RootDataStore => {
    const allActiveTasks = new Map<string, Task[]>(appData.tasks);
    const overdueTasks: Task[] = appData.overdueTasks || []
    const today: Date = parseFromDDMMyyyy(getToday())
    const overdueKeys: string[] = []

    allActiveTasks.forEach((value, key) => {
        if (today > parseFromDDMMyyyy(key)) {
            overdueTasks.push(...value)
            overdueKeys.push(key)
        }
    })

    overdueKeys.forEach(value => {
        allActiveTasks.delete(value)
    })

    return {
        ...appData,
        tasks: new Map<string, Task[]>(allActiveTasks),
        overdueTasks
    }
}