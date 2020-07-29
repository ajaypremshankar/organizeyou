import {CompletedTask, Task} from "./types";
import {KeyTitlePair} from "./key-title-pair";

export class DisplayableTaskList {

    private readonly _keyTitle: KeyTitlePair;
    private readonly _tasks: Task[] | CompletedTask[];

    constructor(key: number, tasks: Task[] | CompletedTask[]) {
        this._keyTitle = new KeyTitlePair(key);
        this._tasks = tasks
    }

    get key(): number {
        return this._keyTitle.key;
    }

    get title(): string {
        return this._keyTitle.title;
    }

    get keyTitle(): KeyTitlePair {
        return this._keyTitle;
    }

    get tasks(): Task[] | CompletedTask[] {
        return this._tasks;
    }


    public isNotEmpty(): boolean {
        return this._tasks.length !== 0
    }

}