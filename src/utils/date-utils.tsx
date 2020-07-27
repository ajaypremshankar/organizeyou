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

export const getDayAfterTomorrow = (): string => {
    const today = new Date();
    return formatToDDMMyyyy(addDays(today, 2))
}

export const formatToSlashes = (withoutSlashes: string): string => {
    const date = parseFromDDMMyyyy(withoutSlashes)
    return formatToDDMMyyyy(date, true)
}

export const getDayTypeFromDate = (date: string) => {

    if (getToday() === date) return DayType.TODAY;

    if (getTomorrow() === date) return DayType.TOMORROW;

    else return formatToDOMMM(date)
}

export const eitherTodayOrTomorrow = (date: Date | string): boolean => {
    const dateStr = typeof date === "string" ? date : formatToDDMMyyyy(date as Date)
    return dateStr === getToday() || dateStr === getTomorrow()
}

export const formatToDOMMM = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? parseFromDDMMyyyy(date) : date
    return format(dateObj, 'do MMM')
}