import { CompletedTask, ListType, SettingsType, Task } from "./types";
import { DisplayableTaskList } from "./displayable-task-list";
import { getCurrentMillis, getTodayKey } from "../utils/date-utils";
import { KeyTitlePair } from "./key-title-pair";

export class BaseTasksState {
    private readonly _selectedDate: number;
    private readonly _keyTitle: KeyTitlePair;
    private readonly _tasks: Map<number, Task[] | CompletedTask[]>;
    private readonly _completedTasks: CompletedTask[];
    private readonly _settings: Map<SettingsType, boolean>;

    constructor(selectedDate: number,
                tasks: Map<number, Task[] | CompletedTask[]>,
                completedTasks: CompletedTask[],
                settings: Map<SettingsType, boolean>) {
        this._selectedDate = selectedDate;
        this._keyTitle = new KeyTitlePair(selectedDate)
        this._tasks = tasks;
        this._completedTasks = completedTasks || []
        this._settings = settings;
    }

    get tasks(): Map<number, Task[] | CompletedTask[]> {
        return this._tasks;
    }

    get completedTasks(): CompletedTask[] {
        return this._completedTasks;
    }

    get settings(): Map<SettingsType, boolean> {
        return this._settings;
    }

    get selectedDate(): number {
        return this._selectedDate;
    }

    public getOverdueTasks(sorter?: (a: Task | CompletedTask, b: Task | CompletedTask) => number): DisplayableTaskList {
        const reducedList: Task[] | CompletedTask[] = BaseTasksState.computeOverdueTasks(this._tasks)
        return new DisplayableTaskList(ListType.OVERDUE, reducedList, sorter)
    }

    public getCompletedTasks(sorter?: (a: Task | CompletedTask, b: Task | CompletedTask) => number): DisplayableTaskList {
        return new DisplayableTaskList(ListType.COMPLETED, this.completedTasks, sorter)
    }

    public getTargetTasks(sorter?: (a: Task | CompletedTask, b: Task | CompletedTask) => number): DisplayableTaskList {

        if (this.isShowAllTasks()) {
            const reducedList: Task[] = []

            this.tasks.forEach((value, key) => {
                if(key !== ListType.COMPLETED) {
                    reducedList.push(...value)
                }
            })

            return new DisplayableTaskList(ListType.ALL, reducedList, sorter)
        } else {
            return this.getSelectedDateTasks(sorter)
        }

    }

    public getSelectedDateTasks(sorter?: (a: Task | CompletedTask, b: Task | CompletedTask) => number): DisplayableTaskList {
        const reducedList: Task[] = []
        reducedList.push(...this._tasks.get(this._selectedDate) || [])
        return new DisplayableTaskList(this._selectedDate, reducedList, sorter)
    }

    public moveTask(from: number, to: number, task: Task | CompletedTask): BaseTasksState {

        if(from === to) return this

        const now = getCurrentMillis()
        const newTasks = this.internalAddTask(to, {
            ...task,
            updatedOn: now
        }, this.tasks)

        const removedTasks: Map<number, Task[] | CompletedTask[]> = this.internalRemoveTask(from, task, newTasks)

        return new BaseTasksState(this.selectedDate, removedTasks, this.completedTasks, this._settings)
    }

    public completeTask(from: number, task: Task): BaseTasksState {
        const completeTask: CompletedTask = {
            ...task,
            completedDate: getCurrentMillis(),
        }

        const completedTasks = [...this.completedTasks, completeTask]

        return new BaseTasksState(this.selectedDate,
            this.internalRemoveTask(task.plannedOn, task, this.tasks),
            completedTasks,
            this._settings)
    }

    public undoCompleteTask(task: Task): BaseTasksState {

        const completedTasks = this.completedTasks.filter(value => value.id !== task.id)
        return new BaseTasksState(this.selectedDate,
            this.internalAddTask(task.plannedOn, task, this.tasks),
            completedTasks,
            this._settings)
    }

    public addTask(key: number, task: Task | CompletedTask): BaseTasksState {
        return new BaseTasksState(this.selectedDate,
            this.internalAddTask(key, task, this.tasks),
            this.completedTasks,
            this._settings)
    }

    public removeTask(key: number, task: Task | CompletedTask): BaseTasksState {
        return new BaseTasksState(this.selectedDate,
            this.internalRemoveTask(key, task, this.tasks),
            this.completedTasks,
            this._settings)
    }


    private internalAddTask(key: number, task: Task | CompletedTask,
                            tasks: Map<number, Task[] | CompletedTask[]>): Map<number, Task[] | CompletedTask[]> {
        const reducedList = [...tasks.get(key) || []].filter(t => t.id !== task.id)
        reducedList.push(task)
        const newTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[] | CompletedTask[]>(tasks)
        newTasks.set(key, reducedList)
        return newTasks
    }

    private internalRemoveTask(key: number, task: Task | CompletedTask,
                               tasks: Map<number, Task[] | CompletedTask[]>): Map<number, Task[] | CompletedTask[]> {
        const reducedList = [...tasks.get(key) || []].filter(t => t.id !== task.id)
        const newTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[] | CompletedTask[]>(tasks)
        newTasks.set(key, Array.from(reducedList))
        return newTasks
    }

    private static computeOverdueTasks(tasks: Map<number, Task[] | CompletedTask[]>): Task[] | CompletedTask[] {
        const reducedList: Task[] = []

        const today = getTodayKey()

        tasks.forEach((value, key) => {
            const tasks: Task[] = value as Task[]
            if (today > key) {
                reducedList.push(...tasks)
            }
        })

        return reducedList
    }

    public toggleSetting = (type: SettingsType) => {
        const settings = new Map<SettingsType, boolean>(this.settings)
        settings.set(type, !this.settings.get(type))
        return new BaseTasksState(this.selectedDate,
            this.tasks,
            this.completedTasks,
            settings);
    }

    public pendingTasksCount = () => {
        return BaseTasksState.computeOverdueTasks(this.tasks).length
            + (this.tasks.get(getTodayKey()) || []).length
    }

    public isShowAllTasks = () => {
        return this.settings.get(SettingsType.SHOW_ALL_TASKS) || false
    }

    public getKeyTitle(): KeyTitlePair {
        return this._keyTitle
    }
}