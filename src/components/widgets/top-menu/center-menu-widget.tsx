import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Clock from "./clock";
import { getClockOptions } from "../../../utils/settings-utils";
import { SettingsType } from "../../../types/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
            },
        },
    }),
);

interface CenterMenuWidgetProps {
    settings: Map<SettingsType, boolean>
}

export default function CenterMenuWidget(props: CenterMenuWidgetProps) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Clock options={getClockOptions(props.settings)}/>
        </div>
    )
}
