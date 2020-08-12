import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { isFirefox } from "react-device-detect";
import NavigationLinks from "./browser-navigate-links";
import Clock from "./clock";
import { getClockOptions } from "../../../utils/settings-utils";
import { SettingsType } from "../../../types/types";
import AppMode from "./app-mode-toggle";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                marginTop: theme.spacing(2),
            },
        },
    }),
);

interface TopAlwaysOnMenuProps {

}

export default function LeftMenuWidget(props: TopAlwaysOnMenuProps) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppMode/>
            {!isFirefox && <NavigationLinks/>}
        </div>
    )
}
