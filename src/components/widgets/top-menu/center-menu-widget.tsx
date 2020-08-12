import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { isFirefox } from "react-device-detect";
import NavigationLinks from "./browser-navigate-links";
import Clock from "./clock";
import { getClockOptions } from "../../../utils/settings-utils";
import { SettingsType } from "../../../types/types";

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
    settings: Map<SettingsType, boolean>
}

export default function CenterMenuWidget(props: TopAlwaysOnMenuProps) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Clock options={getClockOptions(props.settings)}/>
        </div>
    )
}
