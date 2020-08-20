import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { SettingsType } from "../types/types";
import { SettingsStateStore } from "../state-stores/settings-state";

export const getTheme = () => {

    if (!SettingsStateStore.isEnabled(SettingsType.BACKGROUND_MODE)) {
        return createMuiTheme({
            overrides: {
                MuiPaper: {
                    root: {
                        fontWeight: 500,
                    },
                }
            },
            palette: {
                type: SettingsStateStore.isEnabled(SettingsType.DARK_THEME) ? 'dark' : 'light',
                primary: {
                    main: SettingsStateStore.isEnabled(SettingsType.DARK_THEME) ? '#FFFF' : '#1976d2',
                },
            }
        });
    }

    return createMuiTheme({
        overrides: {
            MuiPaper: {
                root: {
                    fontWeight: 500,
                    background: 'transparent',
                },
            },
            MuiTypography: {
                root: {
                }
            }
        },
        palette: {
            type: 'dark',
            primary: {
                main: '#FFFF',
            },
            background: {
                paper: 'transparent'
            }
        }
    });
}

export const getRootPaperStyle = (): any => {
    if (!SettingsStateStore.isEnabled(SettingsType.BACKGROUND_MODE)) {
        return {
            width: '100%',
            minHeight: '100%',
            height: '100%',
            position: 'absolute',
            overflow: 'auto'
        }
    }

    return {
        width: '100%',
        minHeight: '100%',
        height: '100%',
        position: 'absolute',
        backgroundImage: `url(${SettingsStateStore.getTodayBgUrl()})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        overflow: 'auto'
    }

}

export const getBlackBackground = (index: number) => {
    return !SettingsStateStore.isFullMode() || (index === 0 || !SettingsStateStore.isEnabled(SettingsType.BACKGROUND_MODE))
        ? `rgba(0, 0, 0, 0)` : `rgba(0, 0, 0, 0.3)`
}