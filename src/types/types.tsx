export interface Task {
    id: number,
    value: string;
    plannedOn: number
}

export interface CompletedTask extends Task {
    completedDate: number;
}

export enum ListType {
    OVERDUE = 1010101010,
    COMPLETED = 100000000
}

export enum ListTitleType {
    TODAY = 'today',
    TOMORROW = 'tomorrow',
}