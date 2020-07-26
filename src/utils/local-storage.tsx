import {RootDataStore, Task} from "../types/types";

export const updateAppState = (newState: RootDataStore) => {

    const currentState = loadAppState();

    const state = {
        ...currentState,
        ...newState,
        tasks: JSON.stringify(Array.from(newState.tasks.entries()))
    }

    localStorage.setItem("organizeyou-base-app", JSON.stringify(state))
}


export const loadAppState = (): RootDataStore => {

    const persistedState = localStorage.getItem("organizeyou-base-app");

    if (persistedState) {
        const state = JSON.parse(persistedState)
        return {
            ...state,
            tasks: new Map(JSON.parse(state.tasks)),
            archivedTasks: state.archivedTasks.map((ct: any) => {
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
            showAdd: false,
            currentlySelectedDate: '',
            tasks: new Map<string, Task[]>(),
            archivedTasks: []
        }
    }
}