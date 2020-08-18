import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { StateStore } from "../types/state-store";
import { SettingsType } from "../types/types";
import { getTodayBgUrl } from "./settings-local-storage";

export const getTheme = () => {

    if (!StateStore.isSetting(SettingsType.BACKGROUND_MODE)) {
        return createMuiTheme({
            overrides: {
                MuiPaper: {
                    root: {
                        fontWeight: 500,
                    },
                }
            },
            palette: {
                type: StateStore.isDarkModeEnabled() ? 'dark' : 'light',
                primary: {
                    main: StateStore.isDarkModeEnabled() ? '#FFFF' : '#1976d2',
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
    if (!StateStore.isSetting(SettingsType.BACKGROUND_MODE)) {
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
        backgroundImage: `url(${getTodayBgUrl()})`,
        //backgroundImage: `url('https://source.unsplash.com/sMQiL_2v4vs/2400x1900')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        overflow: 'auto'
    }

}

export const getBlackBackground = (index: number) => {
    return !StateStore.isFullMode() || (index === 0 || !StateStore.isSetting(SettingsType.BACKGROUND_MODE))
        ? `rgba(0, 0, 0, 0)` : `rgba(0, 0, 0, 0.3)`
}