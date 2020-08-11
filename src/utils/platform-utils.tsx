import { isChrome, isEdge, isEdgeChromium, isFirefox } from 'react-device-detect'

export enum PLATFORM {
    EXTENSION_CHROME,
    EXTENSION_FIREFOX,
    EXTENSION_EDGE,
    BROWSER_APP
}

export const getPlatform = (): PLATFORM => {
    if(!isExtension()) return PLATFORM.BROWSER_APP

    if(isChrome) return PLATFORM.EXTENSION_CHROME

    if(isFirefox) return PLATFORM.EXTENSION_FIREFOX

    if(isEdge) return PLATFORM.EXTENSION_EDGE

    else throw new Error("Platform not supported")
}

export const isExtension = () => {
    return window.chrome && window.chrome.storage
}