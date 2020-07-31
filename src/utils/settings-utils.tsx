import {SettingsType} from "../types/types";
import {getTodayKey} from "./date-utils";

export const getClockOptions = (settings: Map<SettingsType, boolean>) => {
    return {
        hour: '2-digit', minute: '2-digit',
        second: settings.get(SettingsType.SHOW_SECONDS) ? '2-digit' : undefined,
        hour12: settings.get(SettingsType.SHOW_AM_PM) ? true : false,
    }
}

export const getEffectiveSelectedDate = (settings: Map<SettingsType, boolean>, defaultValue: number) => {
    return settings.get(SettingsType.REMEMBER_SELECTED_DATE) ? defaultValue : getTodayKey()
}