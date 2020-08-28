export interface Task {
    id: number,
    value: string;
    plannedOn: number;
    createdOn: number;
    updatedOn: number;
    tags?: string[]
}

export interface CompletedTask extends Task {
    completedDate: number;
}

export enum ListType {
    OVERDUE = 1010101010,
    COMPLETED = 100000000,
    ALL = 222000000
}

export enum ListTitleType {
    TODAY = 'today',
    TOMORROW = 'tomorrow',
    ALL = 'all',
}

export interface HashTagTaskMapping {
    value: string
    plannedOn: number
    taskId: number
    completed: boolean
}

export type TaskSorter = (a: Task | CompletedTask, b: Task | CompletedTask) => number