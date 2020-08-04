import { addDays, format, parse } from "date-fns";

export const formatToKey = (date: Date): number => {
    return parseInt(format(date, 'yyyyMMdd'))
}

export const parseFromKey = (key: number, defaultDate: Date = new Date()) => {
    return parse(key.toString(), 'yyyyMMdd', defaultDate)
}

export const getTodayKey = (): number => {
    return formatToKey(new Date())
}

export const getTomorrowKey = (): number => {
    const today = new Date();
    return formatToKey(addDays(today, 1))
}

export const formatToListTitle = (date: Date | number): string => {
    const dateObj = typeof date === "number" ? parseFromKey(date) : date
    return format(dateObj, 'do MMM')
}

export const neitherTodayNorTomorrow = (key: number): boolean => {
    return key !== getTodayKey() && key !== getTomorrowKey()
}

export const getLocaleTime = (options: any) =>{
    return new Date().toLocaleTimeString([], options)
}

export const getDate = () =>{
    return format(new Date(),'EEE, do MMM, yyyy')
}

export const getCurrentMillis = (): number =>{
    return new Date().getTime()
}

export const isPastKey = (key: number): boolean => {
    return getTodayKey() > key
}




