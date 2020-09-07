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

export enum TASK_FREQUENCY_TYPE {
    NO_REPEAT,
    DAILY,
    EVERY_WEEKDAY,
    WEEKLY,
    MONTHLY_DATE,
    MONTHLY_DAY,
    YEARLY,
    CUSTOM,
}

export interface TaskFrequencyMeta {
    day: number /* 1 - mon to 7-sun */
    date: number /* 1 to 31 */
    week: number /* 1 to 4 */
    month: number /* 1 - 12 */
}

export interface TaskFrequencyVO {
    id: number
    meta: Partial<TaskFrequencyMeta>
    nextDateKey: number
}

export type TaskSorter = (a: Task | CompletedTask, b: Task | CompletedTask) => number