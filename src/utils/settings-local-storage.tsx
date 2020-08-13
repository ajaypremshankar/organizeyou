export const updateLocalSettingsState = (updatedState: any) => {
    localStorage.setItem("organizeyou-base-app-2-local-settings", JSON.stringify(updatedState))
}

export const loadLocalSettingsState = (): any => {

    const persistedState = localStorage.getItem("organizeyou-base-app-2-local-settings");

    if (!persistedState) {
        return {fullMode: true}
    }

    return  JSON.parse(persistedState)
}

export const clearLocalSettingsState = () => {
    localStorage.removeItem("organizeyou-base-app-2-local-settings")
}