import { CompletedTask, SettingsType, Task } from "./types";
import { getCurrentMillis, getTodayKey } from "../utils/date-utils";
import { KeyTitlePair } from "./key-title-pair";

/***
 * This class functionalities should be accessed through `StateStore`.
 * 1) Logic for modifying state stays with this class.
 * 2) Logic for transforming and returned curated state related info stays with `StateStore`
 */
export class BaseTasksState {
    private readonly _fullMode: boolean
    private readonly _selectedDate: number;
    private readonly _keyTitle: KeyTitlePair;
    private readonly _tasks: Map<number, Task[]>;
    private readonly _completedTasks: CompletedTask[];
    private readonly _settings: Map<SettingsType, boolean>;

    private constructor(selectedDate: number,
                        tasks: Map<number, Task[]>,
                        completedTasks: CompletedTask[],
                        settings: Map<SettingsType, boolean>,
                        fullMode = true) {
        this._selectedDate = selectedDate;
        this._keyTitle = new KeyTitlePair(selectedDate)
        this._tasks = tasks;
        this._completedTasks = completedTasks || []
        this._settings = settings;
        this._fullMode = fullMode
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

    get fullMode(): boolean {
        return this._fullMode;
    }

    public moveTask(from: number, to: number, task: Task | CompletedTask): BaseTasksState {

        if (from === to) return this

        const now = getCurrentMillis()
        const newTasks = this.internalAddTask(to, {
            ...task,
            updatedOn: now
        }, this.tasks)

        const removedTasks: Map<number, Task[] | CompletedTask[]> = this.internalRemoveTask(from, task, newTasks)

        return this.mergeAndCreateNewState({tasks: removedTasks})
    }

    public completeTask(from: number, task: Task): BaseTasksState {
        const completeTask: CompletedTask = {
            ...task,
            completedDate: getCurrentMillis(),
        }

        const completedTasks = [...this.completedTasks, completeTask]

        const tasksAfterRemove = this.internalRemoveTask(task.plannedOn, task, this.tasks)

        return this.mergeAndCreateNewState({
            tasks: tasksAfterRemove,
            completedTasks: completedTasks
        })
    }

    public undoCompleteTask(task: Task): BaseTasksState {

        const completedTasks = this.completedTasks.filter(value => value.id !== task.id)
        const tasksAfterAdd = this.internalAddTask(task.plannedOn, task, this.tasks)

        return this.mergeAndCreateNewState({
            tasks: tasksAfterAdd,
            completedTasks: completedTasks
        })
    }

    public addTask(key: number, task: Task | CompletedTask): BaseTasksState {
        return this.mergeAndCreateNewState({tasks: this.internalAddTask(key, task, this.tasks),})
    }

    public removeTask(key: number, task: Task | CompletedTask): BaseTasksState {
        return this.mergeAndCreateNewState({tasks: this.internalRemoveTask(key, task, this.tasks)})
    }

    public updateCurrentlySelectedDate = (date: number) => {
        return this.mergeAndCreateNewState({selectedDate: date})
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

    public toggleSetting = (type: SettingsType) => {
        const settings = new Map<SettingsType, boolean>(this.settings)
        settings.set(type, !this.settings.get(type))
        return this.mergeAndCreateNewState({settings: settings})
    }

    public getKeyTitle(): KeyTitlePair {
        return this._keyTitle
    }

    public toggleFullMode = () => {
        return this.mergeAndCreateNewState({fullMode: !this.fullMode})
    }

    public static newStateFrom = (selectedDate: number,
                                  tasks: Map<number, Task[]>,
                                  completedTasks: CompletedTask[],
                                  settings: Map<SettingsType, boolean>,
                                  fullMode = true) => {
        return new BaseTasksState(selectedDate, tasks, completedTasks, settings, fullMode)
    }

    public static emptyState = (): BaseTasksState => {
        return BaseTasksState.newStateFrom(
            getTodayKey(),
            new Map<number, Task[] | CompletedTask[]>(),
            [],
            new Map(),
            true
        )
    }

    private mergeAndCreateNewState = (toBeMerged: any) => {
        return BaseTasksState.newStateFrom(
            toBeMerged.selectedDate || this.selectedDate,
            new Map<number, Task[] | CompletedTask[]>(toBeMerged.tasks || this.tasks),
            [...(toBeMerged.completedTasks || this.completedTasks)],
            new Map(toBeMerged.settings || this.settings),
            toBeMerged.fullMode !== undefined ? toBeMerged.fullMode : this.fullMode
        )
    }
}