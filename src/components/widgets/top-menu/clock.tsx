import React, { useEffect, useState } from 'react'
import { getDate, getLocaleTime } from '../../../utils/date-utils'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { StateStore } from "../../../types/state-store";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        clock: {
            letterSpacing: StateStore.isFullMode() ? '0px' : '-4px',
            fontSize: StateStore.isFullMode() ? '2.5em' : '3em',
            fontWeight: 500,
            marginBottom: StateStore.isFullMode() ? '-40px' : '-60px',
        },
        date: {
            fontWeight: 400,
            letterSpacing: StateStore.isFullMode() ? '0px' : '-1px',
            fontSize: StateStore.isFullMode() ? '0.7em' : '0.9em',
            marginBottom: StateStore.isFullMode() ? '70px' : '110px',
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
