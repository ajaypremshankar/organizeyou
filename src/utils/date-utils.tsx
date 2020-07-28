import {addDays, format, parse} from "date-fns";
import {DayType} from "../types/types";

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

export const getDisplayableDateFromDDMMYYYY = (date: string) => {

    if (getToday() === date) return DayType.TODAY;

    if (getTomorrow() === date) return DayType.TOMORROW;

    else return formatFromKeyToDisplayable(date)
}

export const getKeyFromDisplayableDay = (day: string) => {

    if (DayType.TODAY === day) return getToday();

    if (DayType.TOMORROW === day) return getTomorrow();

    if(DayType.OVERDUE === day) return DayType.OVERDUE;

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