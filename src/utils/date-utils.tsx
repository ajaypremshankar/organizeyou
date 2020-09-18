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

export const formatToListTitle = (date: Date | number, showYear: boolean = true): string => {
    const dateObj = typeof date === "number" ? parseFromKey(date) : date
    return moment(dateObj).format(showYear ? 'Do MMM Y' : 'Do MMM')
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

export const getNextDayKey = (key: number): number => {
    return parseInt(moment(key.toString(), 'YYYYMMDD').add(1, 'days').format('YYYYMMDD'))
}

export const getNextWeekdayKey = (key: number): number => {

    let momObj = moment(key.toString(), 'YYYYMMDD');
    const day = momObj.isoWeekday()

    if (day === 5) {
        momObj.add(3, 'days')
    } else if (day === 6) {
        momObj.add(2, 'days')
    } else {
        momObj.add(1, 'days')
    }

    return parseInt(momObj.format('YYYYMMDD'))
}

export const getNextWeekKey = (key: number): number => {
    let momObj = moment(key.toString(), 'YYYYMMDD');
    momObj.add(1, 'weeks')

    return parseInt(momObj.format('YYYYMMDD'))
}

export const getNextMonthKey = (key: number): number => {
    let momObj = moment(key.toString(), 'YYYYMMDD');
    momObj.add(1, 'months')

    return parseInt(momObj.format('YYYYMMDD'))
}

export const getNextYearKey = (key: number): number => {
    let momObj = moment(key.toString(), 'YYYYMMDD');
    momObj.add(1, 'years')

    return parseInt(momObj.format('YYYYMMDD'))
}

export const formatToDay = (date: Date | number): string => {
    const dateObj = typeof date === "number" ? parseFromKey(date) : date
    return moment(dateObj).format('ddd')
}

