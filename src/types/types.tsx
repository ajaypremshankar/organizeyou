export interface Task {
    id: number,
    value: string;
    plannedDate: string
}

export interface CompletedTask extends Task {
    completedDate: Date;
}

export interface DateTasks {
    date: string;
    tasks: Set<Task>
}

export enum DayType {
    TODAY = 'today',
    TOMORROW = 'tomorrow',
    LATER = 'later'
}

export interface RootState {
    showAdd: boolean,
    currentlySelectedDate: string,
    tasks: Map<string, Set<Task>>,
    archivedTasks?: CompletedTask[]
}