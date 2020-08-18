import { getTodayKey } from "./date-utils";

export const updateLocalSettingsState = (deltaState: any) => {
    const localSettings = loadLocalSettingsState()
    localStorage.setItem("organizeyou-base-app-2-local-settings", JSON.stringify({
        ...localSettings,
        ...deltaState
    }))
}

export const loadLocalSettingsState = (): any => {

    const persistedState = localStorage.getItem("organizeyou-base-app-2-local-settings");

    if (!persistedState) {
        return {
            fullMode: true
        }
    }

    return JSON.parse(persistedState)
}

export const clearLocalSettingsState = () => {
    localStorage.removeItem("organizeyou-base-app-2-local-settings")
}

export const setTodayImageUrl = (force = false) => {
    const localSettings = loadLocalSettingsState()
    if (force || (!localSettings || !localSettings.todayBg
        || localSettings.todayBg.day < getTodayKey())) {

        fetch('https://source.unsplash.com/featured/3200x1800?hill,desktop,wallpapers').then(value => {
            updateLocalSettingsState({
                todayBg: {
                    day: getTodayKey(),
                    url: value.url
                }
            })
        })
    }
}

export const getTodayBgUrl = () => {
    //return 'https://source.unsplash.com/featured/3200x1800?hill,desktop,wallpapers'
    const localSettings = loadLocalSettingsState()
    if (!localSettings || !localSettings.todayBg
        || localSettings.todayBg.day < getTodayKey()) {
        return 'https://source.unsplash.com/featured/3200x1800?hill,desktop,wallpapers'
    }

    return localSettings.todayBg.url
}