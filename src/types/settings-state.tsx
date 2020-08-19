import { SettingsType } from "./types";
import { getTodayKey } from "../utils/date-utils";

export interface SettingsState {
    toggleSettings: Map<SettingsType, boolean>
    objectSettings: Map<SettingsType, any>
}

export class SettingsStateStore {
    private static settingsState: SettingsState
    private static setSettingsState: any

    public static initStore = (state: SettingsState, setState: any) => {
        SettingsStateStore.settingsState = state
        SettingsStateStore.setSettingsState = setState;
    }

    public static loadState = () => {
        const state = SettingsStateStorage.load()
        SettingsStateStore.setSettingsState(state)
        SettingsStateStore.settingsState = state
    }

    private static setToStore = (state: SettingsState) => {
        SettingsStateStore.setSettingsState(state)
        SettingsStateStore.settingsState = state
    }

    public static updateState = (newState: SettingsState, persist: boolean = true) => {
        if (persist) {
            SettingsStateStorage.update(newState)
        }
        SettingsStateStore.setToStore(newState)
    }

    public static getToggleSettings = () => {
        return new Map<SettingsType, boolean>(SettingsStateStore.settingsState.toggleSettings)
    }

    public static toggleSetting = (type: SettingsType) => {
        const toggleSettings = new Map<SettingsType, boolean>(SettingsStateStore.settingsState.toggleSettings)
        toggleSettings.set(type, !toggleSettings.get(type))

        const settings: SettingsState = {
            toggleSettings: toggleSettings,
            objectSettings: new Map<SettingsType, Object>(SettingsStateStore.settingsState.objectSettings)
        }

        SettingsStateStore.updateState(settings)
        return settings
    }

    public static updateObjectSetting = (type: SettingsType, value: Object) => {
        const objectSettings = new Map<SettingsType, Object>(SettingsStateStore.settingsState.objectSettings)
        objectSettings.set(type, {...objectSettings.get(type), ...value})

        const settings: SettingsState = {
            toggleSettings: new Map<SettingsType, boolean>(SettingsStateStore.settingsState.toggleSettings),
            objectSettings: objectSettings
        }

        SettingsStateStore.updateState(settings)
    }

    public static handleShowAllToggle = () => {
        SettingsStateStore.updateState(SettingsStateStore.toggleSetting(SettingsType.SHOW_ALL_TASKS))
    }

    public static handleFullModeToggle = () => {
        SettingsStateStore.updateState(SettingsStateStore.toggleSetting(SettingsType.FULL_MODE))
    }


    public static setIfNotTodayImageUrl = (force = false) => {
        const background = SettingsStateStore.settingsState?.objectSettings?.get(SettingsType.BACKGROUND_MODE)
        if (force || !background || Number(background.day) < getTodayKey()) {

            fetch(`https://source.unsplash.com/featured/1920x1080?hill,desktop,wallpapers`).then(value => {

                SettingsStateStore.loadAndCacheImage(value.url).then(url =>
                    SettingsStateStore.updateObjectSetting(SettingsType.BACKGROUND_MODE, {
                        day: getTodayKey(),
                        url: url,
                    })
                )
            })
        }
    }

    public static getTodayBgUrl = (): string => {
        const background = SettingsStateStore.settingsState?.objectSettings?.get(SettingsType.BACKGROUND_MODE)
        if (!background || Number(background.day) < getTodayKey()) {
            return './pure-white-background.jpg'
        }

        return background.url
    }

    private static loadAndCacheImage = (url: string) => {
        return new Promise((resolve, reject) => {
            try {
                const imageLoader = new Image();
                imageLoader.onload = () => {
                    resolve(url)
                };
                imageLoader.src = SettingsStateStore.getTodayBgUrl()
            } catch (ex) {
                reject(ex);
            }
        })
    }

    public static clear = () => {
        SettingsStateStorage.clear()
    }

    public static isEnabled = (name: SettingsType) => {
        return SettingsStateStore.settingsState.toggleSettings.get(name) || false
    }

    public static getAsObject = (name: SettingsType) => {
        return SettingsStateStore.settingsState.objectSettings.get(name) || {}
    }

    public static isFullMode = () => {
        return SettingsStateStore.settingsState.toggleSettings.get(SettingsType.FULL_MODE) || false
    }

    public static isShowAllTasks = () => {
        return SettingsStateStore.settingsState.toggleSettings.get(SettingsType.SHOW_ALL_TASKS) || false
    }

    public static emptyState = (): SettingsState => {
        const toggleSettings = new Map<SettingsType, boolean>()
        const objectSettings = new Map<SettingsType, Object>()

        return {
            toggleSettings,
            objectSettings
        }
    }
}

class SettingsStateStorage {
    private static key: string = "oy-settings"

    public static update = (deltaState: any) => {
        localStorage.setItem(SettingsStateStorage.key, JSON.stringify({
            toggleSettings: [...Array.from(deltaState.toggleSettings || new Map())],
            objectSettings: [...Array.from(deltaState.objectSettings || new Map())],
        }))
    }

    public static load = (): any => {

        const persistedState = localStorage.getItem(SettingsStateStorage.key);

        const settings = JSON.parse(persistedState || '{}')

        return {
            toggleSettings: settings.toggleSettings ? new Map<SettingsType, boolean>(settings.toggleSettings) : new Map(),
            objectSettings: settings.objectSettings ? new Map<SettingsType, boolean>(settings.objectSettings) : new Map(),
        }
    }

    public static clear = () => {
        localStorage.removeItem(SettingsStateStorage.key)
    }
}

