import React , {useState} from 'react'
import { getLocaleTime, getDate} from '../../utils/date-utils'
import {createStyles, Theme, makeStyles, useTheme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        clock: {
            
            fontFamily: "'Orbitron', sans-serif",
            fontWeight:'bold',
            letterSpacing: '2pt',
            fontSize:'1.5em'
        },
        date: {
            
            fontFamily: "'Orbitron', sans-serif",
            fontWeight:'bold',
            letterSpacing: '2pt',
            fontSize:'0.5em'
        }
    }),
);

export default function Clock() {
    const classes = useStyles();
    let time = getLocaleTime();
    const [ctime, setCtime] = useState(time)
    const [date, setDate] = useState(getDate())
    // const [year, setCtime] = useState(time)

    const updateTime = () =>{
        time = getLocaleTime();
        setCtime(time)
    }

     setInterval(updateTime,1000)

    return (
        <div className={classes.clock}>
           
            <Typography variant="subtitle1" gutterBottom className={classes.clock} color="primary">
                {ctime}
            </Typography>
             { <Typography variant="subtitle1" gutterBottom className={classes.date} color="primary">
                {date}
            </Typography> }
        </div>
    )
}
