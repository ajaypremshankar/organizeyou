export interface Task {
    id: number,
    value: string;
    plannedOn: number;
    createdOn: number;
    updatedOn: number;
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

export enum SettingsType {
    REMEMBER_SELECTED_DATE = 'Remember selected Date',
    SHOW_SECONDS = 'Seconds on clock',
    SHOW_AM_PM = "Show AM/PM",
    SHOW_ALL_TASKS = 'Show all tasks list',
    ABOUT_US = 'Who are we?',
    DARK_THEME = 'Dark Theme'
}

export type TaskSorter = (a: Task | CompletedTask, b: Task | CompletedTask) => number