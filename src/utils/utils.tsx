import {addDays, format} from "date-fns";
import {DayType} from "../types/types";

export const getDateFromDay = (day: string) => {
    const today = new Date();
    if (day === 'today') {
        return format(today, 'dd/MM/yyyy')
    } else if (day === 'tomorrow') {
        return format(addDays(today, 1), 'dd/MM/yyyy')
    } else {
        return day
    }
}

export const getToday = () => {
    return format(new Date(), 'dd/MM/yyyy')
}

export const getTomorrow = () => {
    const today = new Date();
    return format(addDays(today, 1), 'dd/MM/yyyy')
}

export const getDayTypeFromDate = (date: string) => {

    if (getToday() === date) return DayType.TODAY;

    if (getTomorrow() === date) return DayType.TOMORROW;

    else return DayType.LATER
}