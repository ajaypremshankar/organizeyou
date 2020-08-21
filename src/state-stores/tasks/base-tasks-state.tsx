import { CompletedTask, Task } from "../../types/types";
import { getCurrentMillis, getTodayKey } from "../../utils/date-utils";

/***
 * This class functionalities should be accessed through `StateStore`.
 * 1) Logic for modifying state-stores stays with this class.
 * 2) Logic for transforming and returned curated state-stores related info stays with `StateStore`
 */
export class BaseTasksState {
    private readonly _selectedDate: number;
    private readonly _tasks: Map<number, Task[]>;
    private readonly _completedTasks: CompletedTask[];

    private constructor(selectedDate: number,
                        tasks: Map<number, Task[]>,
                        completedTasks: CompletedTask[]) {
        this._selectedDate = selectedDate;
        this._tasks = tasks;
        this._completedTasks = completedTasks || []
    }

    get tasks(): Map<number, Task[] | CompletedTask[]> {
        return this._tasks;
    }

    get completedTasks(): CompletedTask[] {
        return this._completedTasks;
    }

    get selectedDate(): number {
        return this._selectedDate;
    }

    public moveTask(from: number, to: number, task: Task | CompletedTask): BaseTasksState {

        const now = getCurrentMillis()
        const newTasks = this.internalAddOrUpdateTask(to, {
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
        const tasksAfterAdd = this.internalAddOrUpdateTask(task.plannedOn, task, this.tasks)

        return this.mergeAndCreateNewState({
            tasks: tasksAfterAdd,
            completedTasks: completedTasks
        })
    }

    public addTasks(tasks: Task[]): BaseTasksState {
        let tasksAfterAdd = this.tasks
        tasks.forEach(task => {
            tasksAfterAdd = this.internalAddOrUpdateTask(task.plannedOn, task, tasksAfterAdd)
        })

        return this.mergeAndCreateNewState({tasks: tasksAfterAdd})
    }

    public addOrUpdateTask(key: number, task: Task | CompletedTask): BaseTasksState {
        const tasksAfterAdd = this.internalAddOrUpdateTask(key, task, this.tasks)
        return this.mergeAndCreateNewState({tasks: tasksAfterAdd,})
    }

    public removeTask(key: number, task: Task | CompletedTask): BaseTasksState {
        const tasksAfterRemove = this.internalRemoveTask(key, task, this.tasks)
        return this.mergeAndCreateNewState({tasks: tasksAfterRemove})
    }

    public updateCurrentlySelectedDate = (date: number) => {
        return this.mergeAndCreateNewState({selectedDate: date})
    }

    private internalAddOrUpdateTask(key: number, task: Task | CompletedTask,
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

    public static newStateFrom = (selectedDate: number,
                                  tasks: Map<number, Task[]>,
                                  completedTasks: CompletedTask[]) => {
        return new BaseTasksState(selectedDate, tasks, completedTasks)
    }

    public static emptyState = (): BaseTasksState => {
        return BaseTasksState.newStateFrom(
            getTodayKey(),
            new Map<number, Task[] | CompletedTask[]>(),
            [],
        )
    }

    private mergeAndCreateNewState = (toBeMerged: any) => {
        return BaseTasksState.newStateFrom(
            toBeMerged.selectedDate || this.selectedDate,
            new Map<number, Task[] | CompletedTask[]>(toBeMerged.tasks || this.tasks),
            [...(toBeMerged.completedTasks || this.completedTasks)],
        )
    }
}