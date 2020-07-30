import {CompletedTask, ListType, Task} from "./types";
import {DisplayableTaskList} from "./displayable-task-list";
import {getTodayKey} from "../utils/date-utils";
import {KeyTitlePair} from "./key-title-pair";

export class BaseTasksState {
    private readonly _selectedDate: number;
    private readonly _keyTitle: KeyTitlePair;
    private readonly _tasks: Map<number, Task[] | CompletedTask[]>;

    constructor(selectedDate: number, tasks: Map<number, Task[] | CompletedTask[]>, refreshOverdue: boolean = false) {
        this._selectedDate = selectedDate;
        this._keyTitle = new KeyTitlePair(selectedDate)
        this._tasks = refreshOverdue ? BaseTasksState.computeOverdueTasks(tasks) : tasks;
    }

    get tasks(): Map<number, Task[] | CompletedTask[]> {
        return this._tasks;
    }

    get selectedDate(): number {
        return this._keyTitle.key;
    }

    public getOverdueTasks(sorter?: (a: Task|CompletedTask, b: Task|CompletedTask) => number): DisplayableTaskList {
        const newTasks: Map<number, Task[] | CompletedTask[]> = BaseTasksState.computeOverdueTasks(this._tasks)
        const reducedList: Task[] | CompletedTask[] = newTasks.get(ListType.OVERDUE) || []
        return new DisplayableTaskList(ListType.OVERDUE, reducedList, sorter)
    }

    public getCompletedTasks(sorter?: (a: Task|CompletedTask, b: Task|CompletedTask) => number): DisplayableTaskList {
        const reducedList: CompletedTask[] = []
        const tempList = [...this._tasks.get(ListType.COMPLETED) || []]
        tempList.map(t => reducedList.push(t as CompletedTask))
        return new DisplayableTaskList(ListType.COMPLETED, reducedList, sorter)
    }

    public getSelectedDateTasks(sorter?: (a: Task|CompletedTask, b: Task|CompletedTask) => number): DisplayableTaskList {
        const reducedList: Task[] = []
        reducedList.push(...this._tasks.get(this._selectedDate) || [])
        return new DisplayableTaskList(this._selectedDate, reducedList, sorter)
    }

    public completeTask(task: Task): BaseTasksState {
        const now = new Date().getTime()
        const newTasks = this.internalAddTask(ListType.COMPLETED, {
            ...task,
            completedDate: now,
            updatedOn: now
        }, this.tasks)

        const removedTasks: Map<number, Task[] | CompletedTask[]> = this.internalRemoveTask(task.plannedOn, task, newTasks)

        return new BaseTasksState(this.selectedDate, removedTasks)
    }

    public undoCompleteTask(task: Task): BaseTasksState {
        const removedTasks: Map<number, Task[] | CompletedTask[]> = this.internalRemoveTask(ListType.COMPLETED, task, this.tasks)
        const newTasks: Map<number, Task[] | CompletedTask[]> = this.internalAddTask(task.plannedOn, task, removedTasks)
        return new BaseTasksState(this.selectedDate, newTasks, true)
    }

    public addTask(key: number, task: Task | CompletedTask): BaseTasksState {
        return new BaseTasksState(this.selectedDate, this.internalAddTask(key, task, this.tasks))
    }

    public removeTask(key: number, task: Task | CompletedTask): BaseTasksState {
        return new BaseTasksState(this.selectedDate, this.internalRemoveTask(key, task, this.tasks))
    }

    private internalAddTask(key: number, task: Task | CompletedTask,
                            tasks: Map<number, Task[] | CompletedTask[]>): Map<number, Task[] | CompletedTask[]> {
        const reducedList = [...tasks.get(key) || []].filter(t => t.id !== task.id)
        reducedList.push(task)
        const newTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[]|CompletedTask[]>(tasks)
        newTasks.set(key, reducedList)
        return newTasks
    }

    private internalRemoveTask(key: number, task: Task | CompletedTask,
                               tasks: Map<number, Task[] | CompletedTask[]>): Map<number, Task[] | CompletedTask[]>  {
        const reducedList = new Set(tasks.get(key) || [])
        reducedList.delete(task)
        const newTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[]|CompletedTask[]>(tasks)
        newTasks.set(key, Array.from(reducedList))
        return newTasks
    }

    private static computeOverdueTasks(tasks: Map<number, Task[] | CompletedTask[]>): Map<number, Task[] | CompletedTask[]>{
        const reducedList: Task[] = []
        const newTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[]|CompletedTask[]>(tasks)
        reducedList.push(...tasks.get(ListType.OVERDUE) || [])

        const removedKeys: number[] = []
        const today = getTodayKey()

        tasks.forEach((value, key) => {
            const tasks: Task[] = value as Task[]
            if(today > key) {
                reducedList.push(...tasks)
                removedKeys.push(key)
            }
        })

        removedKeys.forEach(k => {
            newTasks.delete(k)
        })

        newTasks.set(ListType.OVERDUE, reducedList)

        return newTasks
    }

    public getKeyTitle(): KeyTitlePair {
        return this._keyTitle
    }
}