import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { formatToKey, getTodayKey, getTomorrowKey, neitherTodayNorTomorrow } from "../../utils/date-utils";
import { KeyTitlePair } from "../../types/key-title-pair";
import AppDatePicker from "../common/date-picker";
import { Link } from "@material-ui/core";
import { getPlatform, PLATFORM } from "../../utils/platform-utils";
import TabIcon from '@material-ui/icons/Tab';
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
                break
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
            console.log(tab, link)
            if(tab && tab.id) {
                window.chrome.tabs.update(tab.id, {url: link})
                console.log('updated')
            }
        })
    }

    return (
        <div className={classes.fullWidth}>
            <ButtonGroup variant="text" size={"small"} color="primary" aria-label="text primary button group">
                <Button onClick={() => handleOnClick(NAVIGATION_TYPE.NEW_TAB)}>New Tab</Button>
                <Button onClick={() => handleOnClick(NAVIGATION_TYPE.BOOKMARKS)}>Bookmarks</Button>
                <Button onClick={() => handleOnClick(NAVIGATION_TYPE.APPS)}>Apps</Button>
            </ButtonGroup>
        </div>
    );
}
