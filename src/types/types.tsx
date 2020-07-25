export interface Task {
    id: number,
    value: string;
    plannedDate: string
}

export interface CompletedTask extends Task {
    completedDate: Date;
}

export enum DayType {
    TODAY = 'today',
    TOMORROW = 'tomorrow',
    LATER = 'later'
}

export interface RootDataStore {
    showAdd: boolean,
    currentlySelectedDate: string,
    tasks: Map<string, Set<Task>>,
    archivedTasks?: CompletedTask[]
}

export interface DisplayableDay {
    day: string,
    ddmm: string
    date: string,
}