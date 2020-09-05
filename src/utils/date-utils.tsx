import moment from "moment"

export const formatToKey = (date: Date): number => {
    return parseInt(moment(date).format('YYYYMMDD'))
}

export const parseFromKey = (key: number, defaultDate: Date = new Date()) => {
    return moment(key.toString(), 'YYYYMMDD').toDate()
}

export const getTodayKey = (): number => {
    return formatToKey(new Date())
}

export const getTomorrowKey = (): number => {
    return formatToKey(moment().add(1, 'days').toDate())
}

export const formatToListTitle = (date: Date | number): string => {
    const dateObj = typeof date === "number" ? parseFromKey(date) : date
    return moment(dateObj).format('Do MMM')
}

export const neitherTodayNorTomorrow = (key: number): boolean => {
    return key !== getTodayKey() && key !== getTomorrowKey()
}

export const getCurrentMillis = (): number => {
    return new Date().getTime()
}

export const isPastKey = (key: number): boolean => {
    return getTodayKey() > key
}


