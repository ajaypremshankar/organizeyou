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
    COMPLETED = 100000000
}

export enum ListTitleType {
    TODAY = 'today',
    TOMORROW = 'tomorrow',
}

export interface UserSettings {
    rememberSelectedDate: boolean,
    neverSignIn: boolean
}

export enum SettingsType {
    REMEMBER_SELECTED_DATE = 'Remember selected Date',
    SHOW_SECONDS = 'Show seconds on clock',
    SHOW_ALL_TASKS = 'Show all tasks list'
}