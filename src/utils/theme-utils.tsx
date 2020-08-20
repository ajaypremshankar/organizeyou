import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { SettingsStateStore, SettingsType } from "../state-stores/settings/settings-state";

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

export const getTransparentBackgroundColor = (preCondition: boolean, transparencyLevel: number) => {
    return preCondition ? `rgba(0, 0, 0, ${transparencyLevel})` : `rgba(0, 0, 0, 0)`
}