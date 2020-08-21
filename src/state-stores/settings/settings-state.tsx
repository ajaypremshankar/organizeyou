import { getTodayKey } from "../../utils/date-utils";
import { migrateToBucketedKeySupport } from "../tasks/bucketed-migrations-utils";

/***
 * Enum type used as key for settings
 */
export enum SettingsType {
    REMEMBER_SELECTED_DATE = 'Remember selected Date',
    SHOW_SECONDS = 'Seconds on clock',
    SHOW_AM_PM = "Show AM/PM",
    SHOW_ALL_TASKS = 'Show all tasks list',
    SHOW_COMPLETED_TASKS = 'Show completed tasks list',
    ABOUT_US = 'Who are we?',
    DARK_THEME = 'Dark theme',
    BACKGROUND_MODE = 'Daily background wallpaper',
    FULL_MODE = 'Full mode',
    MIGRATE_TO_BUCKETED_STORE = 'oy_m_t_b_s',
    APP_LOADING = 'loading',
}

/***
 * Data structure for settings
 */
interface SettingsState {
    toggleSettings: Map<SettingsType, boolean>
    objectSettings: Map<SettingsType, any>
}

/***
 * Settings management done here.
 * * Get settings
 * * Add/update settings
 */
export class SettingsStateStore {
    private static settingsState: SettingsState
    private static setSettingsState: any

    public static initStore = (state: SettingsState, setState: any) => {
        SettingsStateStore.settingsState = state
        SettingsStateStore.setSettingsState = setState;
    }

    public static loadState = () => {
        SettingsStateStore.setDefaultsIfNotAvailable()
    }

    private static setToStore = (state: SettingsState) => {
        SettingsStateStore.setSettingsState(state)
        SettingsStateStore.settingsState = state
    }

    private static setDefaultsIfNotAvailable = () => {
        let toggleSettings = new Map<SettingsType, boolean>();
        let objectSettings = new Map<SettingsType, any>();
        const stateFromStorage = SettingsStateStorage.load()

        if (stateFromStorage !== undefined) {
            toggleSettings = stateFromStorage.toggleSettings
            objectSettings = stateFromStorage.objectSettings
        } else {
            SettingsStateStore.toggleAppLoader(true)
            toggleSettings.set(SettingsType.FULL_MODE, true)
            toggleSettings.set(SettingsType.BACKGROUND_MODE, true)
            toggleSettings.set(SettingsType.SHOW_COMPLETED_TASKS, true)
            toggleSettings.set(SettingsType.SHOW_AM_PM, true)
        }

        if(!SettingsStateStore.isEnabled(SettingsType.MIGRATE_TO_BUCKETED_STORE)) {
            migrateToBucketedKeySupport();
            // Mark migration complete
            toggleSettings.set(SettingsType.MIGRATE_TO_BUCKETED_STORE, true)
        }

        const background = objectSettings.get(SettingsType.BACKGROUND_MODE)

        if (!background || Number(background.day) < getTodayKey()) {
            fetch(`https://source.unsplash.com/featured/3200x1800?hill,desktop,wallpapers`).then(value => {
                SettingsStateStore.loadAndCacheImage(value.url).then(url => {
                    objectSettings.set(SettingsType.BACKGROUND_MODE, {
                        day: getTodayKey(),
                        url: url,
                    })

                    // Update state & store only after loading image.
                    // DO-NOT take this state-update out of promise.then
                    toggleSettings.set(SettingsType.APP_LOADING, false)
                    SettingsStateStore.updateState({
                        toggleSettings: toggleSettings,
                        objectSettings: objectSettings
                    });
                })
            })
        } else {
            toggleSettings.set(SettingsType.APP_LOADING, false)
            SettingsStateStore.updateState({
                toggleSettings: toggleSettings,
                objectSettings: objectSettings
            })
        }
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

    public static toggleSetting = (type: SettingsType, setValueTo?: boolean) => {
        const toggleSettings = new Map<SettingsType, boolean>(SettingsStateStore.settingsState.toggleSettings)
        toggleSettings.set(type, setValueTo !== undefined ? setValueTo : !toggleSettings.get(type))

        const settings: SettingsState = {
            toggleSettings: toggleSettings,
            objectSettings: SettingsStateStore.settingsState.objectSettings
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

    public static handleFullModeToggle = (setTo: boolean) => {
        SettingsStateStore.updateState(SettingsStateStore.toggleSetting(SettingsType.FULL_MODE, setTo))
    }

    public static toggleAppLoader = (setToValue: boolean) => {
        SettingsStateStore.updateState(SettingsStateStore.toggleSetting(SettingsType.APP_LOADING, setToValue), false)
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

/***
 * Settings interaction with local-storage goes here.
 */
class SettingsStateStorage {
    private static key: string = "oy-settings"

    public static update = (updatedState: any) => {
        localStorage.setItem(SettingsStateStorage.key, JSON.stringify({
            toggleSettings: [...Array.from(updatedState.toggleSettings || new Map())],
            objectSettings: [...Array.from(updatedState.objectSettings || new Map())],
        }))
    }

    public static load = (): any => {

        const persistedState = localStorage.getItem(SettingsStateStorage.key);

        if(persistedState === null){
            return undefined
        }

        const settings = JSON.parse(persistedState)

        return {
            toggleSettings: settings.toggleSettings ? new Map<SettingsType, boolean>(settings.toggleSettings) : new Map(),
            objectSettings: settings.objectSettings ? new Map<SettingsType, boolean>(settings.objectSettings) : new Map(),
        }
    }

    public static clear = () => {
        localStorage.removeItem(SettingsStateStorage.key)
    }
}

