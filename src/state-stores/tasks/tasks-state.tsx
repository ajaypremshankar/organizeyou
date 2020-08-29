import { CompletedTask, HashTagTaskMapping, Task } from "../../types/types";
import { getTodayKey } from "../../utils/date-utils";

/***
 * This class functionalities should be accessed through `StateStore`.
 * 1) Logic for modifying state-stores stays with this class.
 * 2) Logic for transforming and returned curated state-stores related info stays with `StateStore`
 */
export class TasksState {
    private readonly _selectedDate: number;
    private readonly _selectedList: string;
    private readonly _tasks: Map<number, Task[]>;
    private readonly _completedTasks: CompletedTask[];
    private readonly _hashTags: Map<string, HashTagTaskMapping[]>;

    private constructor(selectedDate: number,
                        selectedList: string,
                        tasks: Map<number, Task[]>,
                        completedTasks: CompletedTask[],
                        hashTags?: Map<string, HashTagTaskMapping[]>) {
        this._selectedDate = selectedDate;
        this._selectedList = selectedList;
        this._tasks = tasks;
        this._completedTasks = completedTasks || []
        this._hashTags = hashTags || new Map<string, HashTagTaskMapping[]>()
    }

    get hashTags(): Map<string, HashTagTaskMapping[]> {
        return this._hashTags;
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

    get selectedList(): string {
        return this._selectedList;
    }

    public moveTask(from: number, movingTask: Task): TasksState {

        const withNewlyAddedTask = this.internalAddOrUpdateTaskTo(movingTask.plannedOn, {
            ...movingTask,
        }, this.tasks)

        const withRemovedTask: Map<number, Task[] | CompletedTask[]> = this.internalRemoveTaskFrom(from, movingTask, withNewlyAddedTask)

        return this.mergeAndCreateNewState({tasks: withRemovedTask})
    }

    public completeTask(task: CompletedTask): TasksState {

        const completedTasks = [...this.completedTasks, task]

        const tasksAfterRemove = this.internalRemoveTaskFrom(task.plannedOn, task, this.tasks)

        return this.mergeAndCreateNewState({
            tasks: tasksAfterRemove,
            completedTasks: completedTasks
        })
    }

    public undoCompleteTask(task: Task): TasksState {

        const completedTasks = this.completedTasks.filter(value => value.id !== task.id)
        const tasksAfterAdd = this.internalAddOrUpdateTaskTo(task.plannedOn, task, this.tasks)

        return this.mergeAndCreateNewState({
            tasks: tasksAfterAdd,
            completedTasks: completedTasks
        })
    }

    public addHashTags(hashTagsArr: HashTagTaskMapping[]): TasksState {

        if (!hashTagsArr || hashTagsArr.length === 0) {
            return this;
        }

        let tagTaskMap = this.hashTags

        hashTagsArr.forEach(tag => {
            const tagTaskArr: HashTagTaskMapping[] = tagTaskMap.get(tag.value) || []
            tagTaskArr.push(tag)
            tagTaskMap.set(tag.value, tagTaskArr)
        })

        return this.mergeAndCreateNewState({hashTags: tagTaskMap})
    }

    public mergeHashTagMap(deltaHashTags: Map<string, HashTagTaskMapping[]>): TasksState {

        if (!deltaHashTags || deltaHashTags.size === 0) {
            return this;
        }

        const tagTaskMap = new Map([...Array.from(this.hashTags.entries()), ...Array.from(deltaHashTags.entries())]);

        return this.mergeAndCreateNewState({hashTags: tagTaskMap})
    }

    public addTasks(tasks: Task[]): TasksState {
        let tasksAfterAdd = this.tasks
        tasks.forEach(task => {
            tasksAfterAdd = this.internalAddOrUpdateTaskTo(task.plannedOn, task, tasksAfterAdd)
        })

        return this.mergeAndCreateNewState({tasks: tasksAfterAdd})
    }

    public addOrUpdateTask(task: Task | CompletedTask): TasksState {
        const tasksAfterAdd = this.internalAddOrUpdateTaskTo(task.plannedOn, task, this.tasks)
        return this.mergeAndCreateNewState({tasks: tasksAfterAdd,})
    }

    public removeTask(task: Task): TasksState {
        const tasksAfterRemove = this.internalRemoveTaskFrom(task.plannedOn, task, this.tasks)
        return this.mergeAndCreateNewState({tasks: tasksAfterRemove})
    }

    public removeCompletedTask(task: CompletedTask): TasksState {
        const newCompletedTasks = [...this.completedTasks].filter(x => x.id !== task.id)
        return this.mergeAndCreateNewState({completedTasks: newCompletedTasks})
    }

    public updateCurrentlySelectedDate = (date: number) => {
        return this.mergeAndCreateNewState({selectedDate: date, selectedList: ""})
    }

    public updateCurrentlySelectedList = (list: string) => {
        return this.mergeAndCreateNewState({selectedList: list})
    }

    private internalAddOrUpdateTaskTo(key: number, task: Task | CompletedTask,
                                      tasks: Map<number, Task[] | CompletedTask[]>): Map<number, Task[] | CompletedTask[]> {

        const reducedList = [...(tasks.get(key) || [])].filter(t => t.id !== task.id)
        reducedList.push(task)
        const newTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[] | CompletedTask[]>(tasks)
        newTasks.set(key, reducedList)
        return newTasks
    }

    private internalRemoveTaskFrom(key: number, task: Task | CompletedTask,
                                   tasks: Map<number, Task[] | CompletedTask[]>): Map<number, Task[] | CompletedTask[]> {
        const reducedList = [...(tasks.get(key) || [])].filter(t => t.id !== task.id)
        const newTasks: Map<number, Task[] | CompletedTask[]> = new Map<number, Task[] | CompletedTask[]>(tasks)

        if (reducedList.length > 0) {
            newTasks.set(key, reducedList)
        } else {
            newTasks.delete(key)
        }
        return newTasks
    }

    public static newStateFrom = (selectedDate: number,
                                  selectedList: string,
                                  tasks: Map<number, Task[]>,
                                  completedTasks: CompletedTask[],
                                  hashTags: Map<string, HashTagTaskMapping[]>) => {
        return new TasksState(selectedDate, selectedList, tasks, completedTasks, hashTags)
    }

    public static emptyState = (): TasksState => {
        return TasksState.newStateFrom(
            getTodayKey(),
            "",
            new Map<number, Task[] | CompletedTask[]>(),
            [],
            new Map<string, HashTagTaskMapping[]>()
        )
    }

    private mergeAndCreateNewState = (toBeMerged: any) => {
        return TasksState.newStateFrom(
            toBeMerged.selectedDate || this.selectedDate,
            ('selectedList' in toBeMerged) ? toBeMerged.selectedList : this.selectedList,
            new Map<number, Task[] | CompletedTask[]>(toBeMerged.tasks || this.tasks),
            [...(toBeMerged.completedTasks || this.completedTasks)],
            new Map<string, HashTagTaskMapping[]>(toBeMerged.hashTags || this.hashTags)
        )
    }
}