export interface Task {
    id: number,
    value: string;
    plannedOn: string
}

export interface CompletedTask extends Task {
    completedDate: Date;
}

export enum TaskListType {
    TODAY = 'today',
    TOMORROW = 'tomorrow',
    OVERDUE = 'overdue',
    COMPLETED = 'completed'
}

export interface AppDataStore {
    currentlySelectedDate: string,
    tasks: Map<string, Task[]>,
    completedTasks?: CompletedTask[]
    overdueTasks?: Task[]
}

// Used for state updates
export interface DeltaAppDataStore {
    currentlySelectedDate?: string,
    tasks?: Map<string, Task[]>,
    completedTasks?: CompletedTask[]
    overdueTasks?: Task[]
}

export interface DisplayableDay {
    day: string,
    ddmm: string
    date: string,
}