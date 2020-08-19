import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Clock from "./clock";
import { getClockOptions } from "../../../utils/settings-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
            },
        },
    }),
);

interface CenterMenuWidgetProps {

}

export default function CenterMenuWidget(props: CenterMenuWidgetProps) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Clock options={getClockOptions()}/>
        </div>
    )
}
