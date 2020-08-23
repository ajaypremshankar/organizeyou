import React, { useEffect, useState } from 'react'
import { getTimeInFormatAsPerSettings, getDate } from '../../../utils/date-utils'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { SettingsStateStore } from "../../../state-stores/settings/settings-state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        clock: {
            letterSpacing: SettingsStateStore.isFullMode() ? '0px' : '-4px',
            fontSize: SettingsStateStore.isFullMode() ? '2.5em' : '3em',
            fontWeight: 500,
            marginBottom: SettingsStateStore.isFullMode() ? '-25px' : '-40px',
        },
        date: {
            fontWeight: 400,
            letterSpacing: SettingsStateStore.isFullMode() ? '0px' : '-1px',
            fontSize: SettingsStateStore.isFullMode() ? '0.7em' : '0.9em',
            marginBottom: SettingsStateStore.isFullMode() ? '70px' : '110px',
        }
    }),
);

interface ClockProps {
}

export default function Clock(props: ClockProps) {

    const classes = useStyles();
    const [ctime, setCtime] = useState(getTimeInFormatAsPerSettings())

    useEffect(() => {

        const updateTime = () => {
            setCtime(getTimeInFormatAsPerSettings())
        }

        const interval = setInterval(updateTime, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [props, SettingsStateStore.getToggleSettings()]);

    return (
        <div className={classes.clock}>
            <Typography variant="subtitle1" gutterBottom className={classes.clock} color="primary">
                {ctime.toUpperCase()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom className={classes.date} color="primary">
                {getDate()}
            </Typography>
        </div>
    )
}
