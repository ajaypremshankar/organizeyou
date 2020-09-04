import { getTodayKey } from "../../utils/date-utils";
import { migrateToBucketedKeySupport } from "../bucket/bucketed-migrations-utils";
import { WorldClock } from "../../components/widgets/world-clock/work-clock-setting";
import moment from "moment-timezone";

/***
 * Enum type used as key for settings
 */
export enum SettingsType {
    REMEMBER_SELECTED_DATE = 'Remember selected Date',
    SHOW_SECONDS = 'Seconds on clock',
    SHOW_AM_PM = "Show AM/PM",
    SHOW_ALL_TASKS = 'Show all tasks list',
    SHOW_COMPLETED_TASKS = 'Show completed tasks',
    ABOUT_US = 'Who are we?',
    DARK_THEME = 'Dark theme',
    BACKGROUND_MODE = 'Background mode',
    FULL_MODE = 'Full mode',
    BUCKETED_STORE_MIGRATION_COMPLETE = 'oy_m_t_b_s',
    APP_LOADING = 'app_loading',
    SHOWING_HASH_TAG_BASED_LIST = 'showing_hash_tag_based_list',
    WORLD_CLOCK_DATA = 'w_c_data',
    SHOW_WORLD_CLOCK = "Show world clock",
    LOCK_CURRENT_WALLPAPER = "Lock current wallpaper",
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
export class SettingsStateService {
    private static settingsState: SettingsState
    private static setSettingsState: any

    public static initStore = (state: SettingsState, setState: any) => {
        SettingsStateService.settingsState = state
        SettingsStateService.setSettingsState = setState;
    }

    public static loadState = () => {
        SettingsStateService.setDefaultsIfNotAvailable()
    }

    private static setToStore = (state: SettingsState) => {
        SettingsStateService.setSettingsState(state)
        SettingsStateService.settingsState = state
    }

    private static setDefaultsIfNotAvailable = () => {
        let {toggleSettings, objectSettings} = SettingsStateService.loadSettings();

        if (!toggleSettings.get(SettingsType.BUCKETED_STORE_MIGRATION_COMPLETE)) {
            migrateToBucketedKeySupport();
            // Mark migration complete
            toggleSettings.set(SettingsType.BUCKETED_STORE_MIGRATION_COMPLETE, true)
        }

        // Every app load should reset hash-tags showing
        toggleSettings.set(SettingsType.SHOWING_HASH_TAG_BASED_LIST, false)

        const background = objectSettings.get(SettingsType.BACKGROUND_MODE)

        //https://source.unsplash.com/featured/3200x1800?scenery,nature,wallpapers,hd
        if (background && Number(background.day) < getTodayKey()
            && toggleSettings.get(SettingsType.LOCK_CURRENT_WALLPAPER)) {
            objectSettings.set(SettingsType.BACKGROUND_MODE, {
                day: getTodayKey(),
                url: background.url,
            })

            // Update state & store only after loading image.
            // DO-NOT take this state-update out of promise.then
            SettingsStateService.saveSettings(toggleSettings, objectSettings);
        } else if (!background || Number(background.day) < getTodayKey()) {

            fetch(`https://source.unsplash.com/collection/220388/1920x1080`).then(value => {
                SettingsStateService.loadAndCacheImage(value.url).then(url => {
                    objectSettings.set(SettingsType.BACKGROUND_MODE, {
                        day: getTodayKey(),
                        url: url,
                    })

                    // Update state & store only after loading image.
                    // DO-NOT take this state-update out of promise.then
                    SettingsStateService.saveSettings(toggleSettings, objectSettings);
                }).catch(reason => {
                    SettingsStateService.saveSettings(toggleSettings, objectSettings);
                })
            }).catch(reason => {
                SettingsStateService.saveSettings(toggleSettings, objectSettings);
            })
        } else {
            SettingsStateService.saveSettings(toggleSettings, objectSettings);
        }
    }

    private static saveSettings(toggleSettings: Map<SettingsType, boolean>, objectSettings: Map<SettingsType, any>) {

        toggleSettings.set(SettingsType.APP_LOADING, false)

        SettingsStateService.updateState({
            toggleSettings: toggleSettings,
            objectSettings: objectSettings
        });
    }

    public static isHashTagListVisible = () => {
        return SettingsStateService.isEnabled(SettingsType.SHOWING_HASH_TAG_BASED_LIST)
    }

    public static setShowHashTags = (toValue: boolean) => {
        const toggleSettings = new Map<SettingsType, boolean>(SettingsStateService.settingsState.toggleSettings)
        toggleSettings.set(SettingsType.SHOWING_HASH_TAG_BASED_LIST, toValue)

        const settings: SettingsState = {
            toggleSettings: toggleSettings,
            objectSettings: SettingsStateService.settingsState.objectSettings
        }

        SettingsStateService.updateState(settings, false)
    }

    private static loadSettings() {
        let toggleSettings = new Map<SettingsType, boolean>();
        let objectSettings = new Map<SettingsType, any>();
        const stateFromStorage = SettingsStateRepository.load()

        if (stateFromStorage !== undefined) {
            toggleSettings = stateFromStorage.toggleSettings
            objectSettings = stateFromStorage.objectSettings
        } else {
            SettingsStateService.toggleAppLoader(true)
            toggleSettings.set(SettingsType.FULL_MODE, true)
            toggleSettings.set(SettingsType.SHOW_COMPLETED_TASKS, true)
            toggleSettings.set(SettingsType.SHOW_AM_PM, true)
            toggleSettings.set(SettingsType.BACKGROUND_MODE, true)

            toggleSettings.set(SettingsType.LOCK_CURRENT_WALLPAPER, false)
            objectSettings.set(SettingsType.WORLD_CLOCK_DATA, SettingsStateService.getDefaultClocks)
        }

        // Enable world clock for the first time.
        if (toggleSettings.get(SettingsType.SHOW_WORLD_CLOCK) === undefined) {
            toggleSettings.set(SettingsType.SHOW_WORLD_CLOCK, true)
        }

        return {toggleSettings, objectSettings};
    }

    public static updateState = (newState: SettingsState, persist: boolean = true) => {
        if (persist) {
            SettingsStateRepository.update(newState)
        }
        SettingsStateService.setToStore(newState)
    }

    public static getToggleSettings = () => {
        return new Map<SettingsType, boolean>(SettingsStateService.settingsState.toggleSettings)
    }

    public static getWorldClockData = () => {
        const clocks = SettingsStateService.getAsObject(SettingsType.WORLD_CLOCK_DATA) as WorldClock[]
        const clockArr: WorldClock[] = []
        Object.keys(clocks).map(function (key: string) {
            clockArr.push(clocks[Number(key)])
            return clockArr;
        });

        return clockArr.length > 0 ? clockArr : SettingsStateService.getDefaultClocks()
    }

    public static toggleSetting = (type: SettingsType, setValueTo?: boolean) => {
        const toggleSettings = new Map<SettingsType, boolean>(SettingsStateService.settingsState.toggleSettings)
        toggleSettings.set(type, setValueTo !== undefined ? setValueTo : !toggleSettings.get(type))

        const settings: SettingsState = {
            toggleSettings: toggleSettings,
            objectSettings: SettingsStateService.settingsState.objectSettings
        }

        SettingsStateService.updateState(settings)
        return settings
    }

    private static getDefaultClocks = () => {
        return [{
            id: 0,
            title: 'Europe/London',
            timezone: 'Europe/London',
            ampmEnabled: true,
        }, {
            id: 1,
            title: moment.tz.guess(),
            timezone: moment.tz.guess(),
            ampmEnabled: true,
        }, {
            id: 2,
            title: 'America/New_York',
            timezone: 'America/New_York',
            ampmEnabled: true,
        }]

    }

    public static updateObjectSetting = (type: SettingsType, value: Object) => {
        const objectSettings = new Map<SettingsType, Object>(SettingsStateService.settingsState.objectSettings)
        objectSettings.set(type, {...value})

        const settings: SettingsState = {
            toggleSettings: new Map<SettingsType, boolean>(SettingsStateService.settingsState.toggleSettings),
            objectSettings: objectSettings
        }

        SettingsStateService.updateState(settings)
    }

    public static handleShowAllToggle = () => {
        SettingsStateService.updateState(SettingsStateService.toggleSetting(SettingsType.SHOW_ALL_TASKS))
    }

    public static handleFullModeToggle = (setTo: boolean) => {
        SettingsStateService.updateState(SettingsStateService.toggleSetting(SettingsType.FULL_MODE, setTo))
    }

    public static toggleAppLoader = (setToValue: boolean) => {
        SettingsStateService.updateState(SettingsStateService.toggleSetting(SettingsType.APP_LOADING, setToValue), false)
    }

    public static getTodayBgUrl = (): string => {
        const background = SettingsStateService.settingsState?.objectSettings?.get(SettingsType.BACKGROUND_MODE)
        if (!background || Number(background.day) < getTodayKey()) {
            return './default_bg.jpg'
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
                imageLoader.src = SettingsStateService.getTodayBgUrl()
            } catch (ex) {
                reject(ex);
            }
        })
    }

    public static clear = () => {
        SettingsStateRepository.clear()
    }

    public static isEnabled = (name: SettingsType) => {
        return SettingsStateService.settingsState.toggleSettings.get(name) || false
    }

    public static getAsObject = (name: SettingsType) => {
        return SettingsStateService.settingsState.objectSettings.get(name) || {}
    }

    public static isFullMode = () => {
        return SettingsStateService.settingsState.toggleSettings.get(SettingsType.FULL_MODE) || false
    }

    public static isShowAllTasks = () => {
        return SettingsStateService.settingsState.toggleSettings.get(SettingsType.SHOW_ALL_TASKS) || false
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
class SettingsStateRepository {
    private static key: string = "oy-settings"

    public static update = (updatedState: any) => {
        localStorage.setItem(SettingsStateRepository.key, JSON.stringify({
            toggleSettings: [...Array.from(updatedState.toggleSettings || new Map())],
            objectSettings: [...Array.from(updatedState.objectSettings || new Map())],
        }))
    }

    public static load = (): any => {

        const persistedState = localStorage.getItem(SettingsStateRepository.key);

        if (persistedState === null) {
            return undefined
        }

        const settings = JSON.parse(persistedState)

        return {
            toggleSettings: settings.toggleSettings ? new Map<SettingsType, boolean>(settings.toggleSettings) : new Map(),
            objectSettings: settings.objectSettings ? new Map<SettingsType, boolean>(settings.objectSettings) : new Map(),
        }
    }

    public static clear = () => {
        localStorage.removeItem(SettingsStateRepository.key)
    }
}

