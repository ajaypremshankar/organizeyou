import {addDays, format, parse} from "date-fns";
import {DayType} from "../types/types";

export const formatToDDMMyyyy = (date: Date, withSlashes: boolean = false) => {
    return format(date, withSlashes ? 'dd/MM/yyyy' : 'ddMMyyyy')
}

export const parseFromDDMMyyyy = (date: string, defaultDate: Date = new Date(), withSlashes: boolean = false) => {
    return parse(date, withSlashes ? 'dd/MM/yyyy' : 'ddMMyyyy', defaultDate)
}

export const getToday = () => {
    return formatToDDMMyyyy(new Date())
}

export const getTomorrow = () => {
    const today = new Date();
    return formatToDDMMyyyy(addDays(today, 1))
}

export const getDayAfterTomorrow = () => {
    const today = new Date();
    return formatToDDMMyyyy(addDays(today, 2))
}

export const formatToSlashes = (withoutSlashes: string) => {
    const date = parseFromDDMMyyyy(withoutSlashes)
    return formatToDDMMyyyy(date, true)
}

export const getDayTypeFromDate = (date: string) => {

    if (getToday() === date) return DayType.TODAY;

    if (getTomorrow() === date) return DayType.TOMORROW;

    else return formatToSlashes(date)
}

export const eitherTodayOrTomorrow = (date: Date) => {
    const dateStr = formatToDDMMyyyy(date)
    return dateStr === getToday() || dateStr === getTomorrow()
}