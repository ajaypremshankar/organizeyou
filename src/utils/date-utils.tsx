import {addDays, format, parse} from "date-fns";
import {TaskListType} from "../types/types";

export const formatToDDMMyyyy = (date: Date, withSlashes: boolean = false): string => {
    return format(date, withSlashes ? 'dd/MM/yyyy' : 'ddMMyyyy')
}

export const parseFromDDMMyyyy = (date: string, withSlashes: boolean = false, defaultDate: Date = new Date()) => {
    return parse(date, withSlashes ? 'dd/MM/yyyy' : 'ddMMyyyy', defaultDate)
}

export const getToday = (): string => {
    return formatToDDMMyyyy(new Date())
}

export const getTomorrow = (): string => {
    const today = new Date();
    return formatToDDMMyyyy(addDays(today, 1))
}

export const getFromKeyToDisplayableDay = (day: string) => {

    if (TaskListType.TODAY === day) return getToday();

    if (TaskListType.TOMORROW === day) return getTomorrow();

    if(TaskListType.OVERDUE === day) return TaskListType.OVERDUE;

    if(TaskListType.COMPLETED === day) return TaskListType.COMPLETED;

    else return formatFromDisplayableToKey(day)
}

export const eitherTodayOrTomorrow = (date: Date | string): boolean => {
    const dateStr = typeof date === "string" ? date : formatToDDMMyyyy(date as Date)
    return dateStr === getToday() || dateStr === getTomorrow()
}

export const formatFromKeyToDisplayable = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? parseFromDDMMyyyy(date) : date
    return format(dateObj, 'do MMM')
}

export const formatFromDisplayableToKey = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? parseFromDDMMyyyy(date) : date
    return format(dateObj, 'do MMM')
}

export const getListTitleFromKey = (key: string) => {

    const date: Date = parseFromDDMMyyyy(key)
    const today: Date = parseFromDDMMyyyy(getToday())

    if(today > date) return TaskListType.OVERDUE;

    if (getToday() === key) return TaskListType.TODAY;

    if (getTomorrow() === key) return TaskListType.TOMORROW;

    else return formatFromKeyToDisplayable(key)
}