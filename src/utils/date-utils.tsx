import { addDays, format, parse } from "date-fns";
import { SettingsStateService, SettingsType } from "../state-stores/settings/settings-state";

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

export const getDate = () =>{
    return format(new Date(),'EEE, do MMM, yyyy')
}

export const getCurrentMillis = (): number =>{
    return new Date().getTime()
}

export const isPastKey = (key: number): boolean => {
    return getTodayKey() > key
}

export const getTimeInFormatAsPerSettings =() => {
    const date = new Date()
    let hours: any = date.getHours();
    let minutes: any = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';

    if(SettingsStateService.isEnabled(SettingsType.SHOW_AM_PM)) {
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
    }
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    hours = hours < 10 ? '0'+ hours : hours;
    let time = hours + ':' + minutes;

    if(SettingsStateService.isEnabled(SettingsType.SHOW_AM_PM)) {
        time = time + ' ' + ampm
    }

    return time;
}


