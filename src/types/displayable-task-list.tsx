import { CompletedTask, Task, TaskSorter } from "./types";

export class DisplayableTaskList {

    private readonly _title: string;
    private readonly _tasks: Task[] | CompletedTask[];

    constructor(title: string, tasks: Task[] | CompletedTask[], sorter: TaskSorter = DisplayableTaskList.defaultAscSorting) {
        this._title = title;
        this._tasks = tasks.sort(sorter)
    }

    get title(): string {
        return this._title;
    }

    get tasks(): Task[] | CompletedTask[] {
        return this._tasks;
    }


    public isNotEmpty(): boolean {
        return !this.isEmpty()
    }

    public isEmpty(): boolean {
        return this._tasks.length === 0
    }

    private static defaultAscSorting = (a: Task|CompletedTask, b: Task|CompletedTask) => {
        return a.id - b.id
    }
}