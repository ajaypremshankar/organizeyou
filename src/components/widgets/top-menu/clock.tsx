import React, { useEffect, useState } from 'react'
import { getTimeInFormatAsPerSettings, getDate } from '../../../utils/date-utils'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { SettingsStateService } from "../../../state-stores/settings/settings-state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        clock: {
            letterSpacing: SettingsStateService.isFullMode() ? '0px' : '-4px',
            fontSize: SettingsStateService.isFullMode() ? '2.3em' : '3em',
            fontWeight: 500,
            marginBottom: SettingsStateService.isFullMode() ? '-25px' : '-40px',
        },
        date: {
            fontWeight: 400,
            letterSpacing: SettingsStateService.isFullMode() ? '0px' : '-1px',
            fontSize: SettingsStateService.isFullMode() ? '0.6em' : '0.9em',
            marginBottom: SettingsStateService.isFullMode() ? '50px' : '110px',
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
    }, [props, SettingsStateService.getToggleSettings()]);

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
