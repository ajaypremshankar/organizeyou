import React, { useEffect, useState } from 'react'
import { getDate, getLocaleTime } from '../../../utils/date-utils'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { SettingsStateStore } from "../../../state-stores/settings-state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        clock: {
            letterSpacing: SettingsStateStore.isFullMode() ? '0px' : '-4px',
            fontSize: SettingsStateStore.isFullMode() ? '2.5em' : '3em',
            fontWeight: 500,
            marginBottom: SettingsStateStore.isFullMode() ? '-40px' : '-60px',
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
    options: any
}

export default function Clock(props: ClockProps) {

    const classes = useStyles();
    const [ctime, setCtime] = useState(getLocaleTime(props.options))

    useEffect(() => {

        const updateTime = () => {
            const time = getLocaleTime(props.options)
            setCtime(time)
        }

        const interval = setInterval(updateTime, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [props.options]);

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
