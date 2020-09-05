import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography';
import { SettingsStateService } from "../../../state-stores/settings/settings-state";
import { WorldClock } from "./work-clock-setting";
import moment from "moment-timezone";
import Moment from "react-moment";
import { ClassNameMap } from "@material-ui/styles/withStyles";
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import { getCurrentMillis } from "../../../utils/date-utils";

interface ClockProps {
    useStyle: (props?: any) => ClassNameMap<any>
    data: WorldClock
    onOpen: (wc: WorldClock) => void
}

export default function Clock(props: ClockProps) {

    const classes = props.useStyle();
    const [ctime, setCtime] = useState(Math.round(getCurrentMillis()/ 1000))
    const [hover, setHover] = useState(false)

    useEffect(() => {

        const updateTime = () => {
            setCtime(Math.round(getCurrentMillis() / 1000))
        }

        const interval = setInterval(updateTime, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [props, SettingsStateService.getToggleSettings()]);

    return (
        <div
            className={classes.root}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}>
            <Typography variant={"caption"} style={{textAlign: "center"}}>
                <Tooltip title={'click to edit clock'}>
                <EditIcon
                    className={classes.arrow}
                    style={{opacity: hover ? '1.0' : '0.0', fontSize: '120%'}}
                    onClick={() => props.onOpen(props.data)}
                    fontSize={"small"}/>
                    </Tooltip><br/>
                <span className={classes.title}>{props.data.title || moment.tz.guess()}</span>
            </Typography>
            <Typography variant="subtitle1" gutterBottom className={classes.clock} color="primary">
                <Moment unix tz={props.data.timezone}
                        format={props.data.ampmEnabled ? 'hh:mm A' : 'HH:mm'}>
                    {ctime}
                </Moment>
            </Typography>
            <Typography variant="subtitle1" gutterBottom className={classes.date} color="primary">
                <Moment unix tz={props.data.timezone}
                        format={'ddd, Do MMM, yyyy'}>
                    {ctime}
                </Moment>
            </Typography>
        </div>
    )
}
