import { getCurrentMillis, getTodayKey } from "./date-utils";
import { SettingsStateService, SettingsType } from "../state-stores/settings/settings-state";

export const getBackgroundUrl = () => {
    let collectionId: number;
    switch (getCurrentMillis() % 2) {
        case 0:
            //https://unsplash.com/collections/1107454/mac-wallpapers
            collectionId = 1107454;
            break;
        default:
            //https://unsplash.com/collections/220388/macos-desktop-wallpapers
            collectionId = 220388
    }

    return `https://source.unsplash.com/collection/${collectionId}/1920x1080`
}

export const getNewWallpaper = (): Promise<any> => {
    return new Promise<any>((resolve, reject) =>
        fetch(getBackgroundUrl()).then(value => {
            loadAndCacheImage(value.url)
                .then(url => resolve(url))
                .catch(reason => reject(reason))
        }).catch(reason => reject(reason))
    )

}

const loadAndCacheImage = (url: string) => {
    return new Promise((resolve, reject) => {
        try {
            const imageLoader = new Image();
            imageLoader.onload = () => {
                resolve(url)
            };
            imageLoader.src = url
        } catch (ex) {
            reject(ex);
        }
    })
}

export const getTodayBgUrl = (): string => {
    const background = SettingsStateService.getAsObject(SettingsType.BACKGROUND_MODE)

    if (background && SettingsStateService.isEnabled(SettingsType.LOCK_CURRENT_WALLPAPER)) {
        return background.url
    }

    if (!background || Number(background.day) < getTodayKey()) {
        return './default_bg.jpg'
    }
    return background.url
}