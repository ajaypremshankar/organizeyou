export interface Task {
    content: string;
    date?: string
}

export interface DayTasks {
    date: string;
    tasks: Task[]
}

export enum DayType {
    TODAY = 'today',
    TOMORROW = 'tomorrow',
    LATER = 'later'
}