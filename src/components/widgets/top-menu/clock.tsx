import React, { useEffect, useState } from 'react'
import { getDate, getLocaleTime } from '../../../utils/date-utils'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        clock: {
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 'bold',
            letterSpacing: '2pt',
            fontSize: '1.5em'
        },
        date: {
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 'bold',
            letterSpacing: '2pt',
            fontSize: '0.5em'
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
            {<Typography variant="subtitle1" gutterBottom className={classes.date} color="primary">
                {getDate()}
            </Typography>}
        </div>
    )
}
