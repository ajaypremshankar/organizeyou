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
    OVERDUE = 'overdue'
}

export interface RootDataStore {
    currentlySelectedDate: string,
    tasks: Map<string, Task[]>,
    completedTasks?: CompletedTask[]
    overdueTasks?: Task[]
}

export interface DisplayableDay {
    day: string,
    ddmm: string
    date: string,
}