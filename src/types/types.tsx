export interface Task {
    id: number,
    value: string;
    plannedOn: string
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
    currentlySelectedDate: string,
    tasks: Map<string, Task[]>,
    archivedTasks?: CompletedTask[]
}

export interface DisplayableDay {
    day: string,
    ddmm: string
    date: string,
}