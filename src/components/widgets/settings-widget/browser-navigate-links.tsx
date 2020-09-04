import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { getPlatform, PLATFORM } from "../../../utils/platform-utils";
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import HomeIcon from '@material-ui/icons/Home';
import AppsIcon from '@material-ui/icons/Apps';
import Tooltip from '@material-ui/core/Tooltip';
import { SettingsStateService, SettingsType } from "../../../state-stores/settings/settings-state";
import { getTransparentBackgroundColor } from "../../../utils/theme-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: '100%'
        },
    }),
);

interface TopButtonGroupProps {
}

enum NAVIGATION_TYPE {
    NEW_TAB,
    BOOKMARKS,
    APPS
}


export default function NavigationLinks(props: TopButtonGroupProps) {
    const classes = useStyles()

    const handleOnClick = (type: NAVIGATION_TYPE) => {
        const platform: PLATFORM = getPlatform()
        switch (platform) {
            case PLATFORM.BROWSER_APP:
                alert(type)
                break
            case PLATFORM.EXTENSION_FIREFOX:
                throw new Error("Feature not supported")
            case PLATFORM.EXTENSION_CHROME:
            case PLATFORM.EXTENSION_EDGE:
                switch (type) {
                    case NAVIGATION_TYPE.NEW_TAB:
                        setCurrentTab('chrome-search://local-ntp/local-ntp.html')
                        break
                    case NAVIGATION_TYPE.APPS:
                        setCurrentTab('chrome://apps')
                        break
                    case NAVIGATION_TYPE.BOOKMARKS:
                        setCurrentTab('chrome://bookmarks')
                        break
                }
        }

    }

    const setCurrentTab = (link: string) => {
        window.chrome.tabs.getCurrent(tab => {
            if (tab && tab.id) {
                window.chrome.tabs.update(tab.id, {url: link})
            }
        })
    }

    return (
        <div className={classes.fullWidth}>
            <ToggleButtonGroup
                style={{background: getTransparentBackgroundColor(SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE), 0.3)}}
                exclusive
                size={"small"}
                orientation="vertical"
                aria-label="text alignment">
                <ToggleButton onClick={() => handleOnClick(NAVIGATION_TYPE.NEW_TAB)} value="new tab"
                              aria-label="centered">
                    <Tooltip title={'Default new tab'}><HomeIcon/></Tooltip>
                </ToggleButton>
                <ToggleButton onClick={() => handleOnClick(NAVIGATION_TYPE.BOOKMARKS)} value="bookmarks"
                              aria-label="centered">
                    <Tooltip title={'Bookmarks'}><BookmarkIcon/></Tooltip>
                </ToggleButton>
                <ToggleButton onClick={() => handleOnClick(NAVIGATION_TYPE.APPS)} value="apps" aria-label="centered">
                    <Tooltip title={'Apps'}><AppsIcon/></Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
