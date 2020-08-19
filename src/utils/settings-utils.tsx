import { SettingsType } from "../types/types";
import { SettingsStateStore } from "../types/settings-state";

export const getClockOptions = () => {
    return {
        hour: 'numeric', minute: 'numeric',
        second: SettingsStateStore.isEnabled(SettingsType.SHOW_SECONDS) ? 'numeric' : undefined,
        hour12: SettingsStateStore.isEnabled(SettingsType.SHOW_AM_PM) ? true : false,
    }
}
