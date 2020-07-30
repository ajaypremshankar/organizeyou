import {SettingsType} from "../types/types";

export const getClockSettings = (settings: Map<SettingsType, boolean>) => {
    return  {
        hour: '2-digit', minute: '2-digit',
        second: settings.get(SettingsType.SHOW_SECONDS) ? '2-digit' : undefined,
        hour12: settings.get(SettingsType.SHOW_AM_PM) ? true : false,
    }
}