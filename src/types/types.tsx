export interface Task {
    id: number,
    value: string;
    plannedOn: number;
    createdOn: number;
    updatedOn: number;
    tags?: string[]
    taskTemplateId?: number
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

export enum TASK_FREQUENCY_TYPE {
    NO_REPEAT = '',
    DAILY = 'Daily',
    WEEKDAYS = 'Weekday',
    WEEKLY = 'Weekly',
    MONTHLY = 'Monthly',
    YEARLY = 'Yearly',
}

export type TaskSorter = (a: Task | CompletedTask, b: Task | CompletedTask) => number

export interface TaskTemplate {
    id: number
    nextPlannedOn: number;
    createdOn: number;
    taskFrequency: TASK_FREQUENCY_TYPE
    currentlyActiveTaskId: number
    currentlyActiveTaskPlannedOn: number
}