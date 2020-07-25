export interface Task {
    content: string;
    date?: string
}

export interface DayTasks {
    day: string;
    tasks: Task[]
}

export enum DayType {
    TODAY = 'today',
    TOMORROW = 'tomorrow',
    OTHER = 'other'
}