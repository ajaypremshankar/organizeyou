import {ListTitleType, ListType} from "./types";
import {formatToListTitle, getTodayKey, getTomorrowKey} from "../utils/date-utils";

export class KeyTitlePair {
    private readonly _key: number;
    private readonly _title: string;

    constructor(key: number) {
        this._key = key;
        this._title = ListType[key] ? ListType[key] : KeyTitlePair.getTitleByKey(key);
    }


    get key(): number {
        return this._key;
    }

    get title(): string {
        return this._title;
    }

    private static getTitleByKey(key: number) {
        if (getTodayKey() === key) return ListTitleType.TODAY;
        else if (getTomorrowKey() === key) return ListTitleType.TOMORROW;
        else return formatToListTitle(key)
    }
}