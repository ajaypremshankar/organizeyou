import { ListTitleType, ListType } from "../types/types";
import { formatToListTitle, getTodayKey, getTomorrowKey } from "./date-utils";

export class KeyTitleUtils {
    public static getTitleByKey(key: number) {
        if (ListType[key]) return ListType[key];
        else if (getTodayKey() === key) return ListTitleType.TODAY;
        else if (getTomorrowKey() === key) return ListTitleType.TOMORROW;
        else return formatToListTitle(key)
    }
}