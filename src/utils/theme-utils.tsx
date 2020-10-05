import { SettingsStateService, SettingsType } from "../state-stores/settings/settings-state";
import { createMuiTheme } from '@material-ui/core/styles';
import { getTodayBgUrl } from "./background-utils";

export const getTheme = () => {

    if (!SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE)) {
        return createMuiTheme({
            overrides: {
                MuiPaper: {
                    root: {
                        fontWeight: 500,
                    },
                }
            },
            palette: {
                type: SettingsStateService.isEnabled(SettingsType.DARK_THEME) ? 'dark' : 'light',
                primary: {
                    main: SettingsStateService.isEnabled(SettingsType.DARK_THEME) ? '#FFFF' : '#1976d2',
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
    if (!SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE)) {
        return {
            width: '100%',
            minHeight: '100%',
            height: '100%',
            position: 'absolute',
            overflow: 'auto',
            fontWeight: 'bold',
            fontSize: '16px',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
        }
    }

    return {
        width: '100%',
        minHeight: '100%',
        height: '100%',
        position: 'absolute',
        backgroundImage: `url(${getTodayBgUrl()})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        overflow: 'auto',
        fontWeight: 'bold',
        fontSize: '16px',
        fontFamily: '"Helvetica-Neue", Helvetica, Arial',
    }

}

export const getTransparentBackgroundColor = (preCondition: boolean, transparencyLevel: number) => {
    return preCondition ? `rgba(0, 0, 0, ${transparencyLevel})` : `rgba(0, 0, 0, 0)`
}