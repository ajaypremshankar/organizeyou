import React, { ChangeEvent, useState } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AppDialog from "../../common/app-dialog";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import moment from "moment-timezone";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export interface WorldClock {
    id: number,
    title: string,
    timezone: string,
    ampmEnabled?: boolean,
}

interface WorldClockSettingProps {
    show: boolean,
    mode: 'Edit' | 'Add',
    data: WorldClock
    onClose: any
    onSave: (wc: WorldClock) => void
}

export default function WorldClockSetting(props: WorldClockSettingProps) {

    const [wcTitleState, setWcTitleState] = useState(props.data.title);
    const [wcTimezoneState, setWcTimezoneState] = useState(props.data.timezone);
    const [twelveOr24HourState, setTwelveOr24HourState] = useState(props.data.ampmEnabled ? '12h' : '24h');

    const handleTimezoneChange = (event: ChangeEvent<{}>, value: string | null) => {
        if (value) {
            setWcTimezoneState(value || '')

            //If title was not set by user
            if (wcTitleState === '' || wcTitleState === props.data.title) {
                setWcTitleState(value)
            }
        }
    }

    const handleOnSaveClock = () => {
        return () => props.onSave({
            ...props.data,
            title: wcTitleState,
            timezone: wcTimezoneState,
            ampmEnabled: twelveOr24HourState === '12h' ? true : false
        });
    }

    function getContent() {
        return (<span>
            <div style={{marginBottom: '10px'}}>
                <TextField
                    id="world-clock-text-field"
                    value={wcTitleState}
                    fullWidth
                    autoComplete={'off'}
                    label="What do you want to call this clock?"
                    onChange={(event) => setWcTitleState(event.target.value)}
                    variant="outlined"/>
            </div>
            <Autocomplete
                id="world-clock-auto-complete"
                options={moment.tz.names()}
                getOptionLabel={(option) => option}
                style={{width: 300, marginBottom: '10px'}}
                onChange={handleTimezoneChange}
                value={wcTimezoneState}
                renderInput={(params) => <TextField {...params} label="Search timezone" variant="outlined"/>}
            />
            <ToggleButtonGroup
                style={{width: '100%'}}
                value={twelveOr24HourState}
                exclusive
                onChange={(event, value) => setTwelveOr24HourState(value)}
                aria-label="text clock-hours">
                <ToggleButton style={{width: '100%'}} value="12h" aria-label="clock-hours 12h">
                    12h
                </ToggleButton>
                <ToggleButton style={{width: '100%'}} value="24h" aria-label="clock-hours 24h">
                    24h
                </ToggleButton>
            </ToggleButtonGroup>
        </span>);
    }

    function getActions() {
        return <Button
            variant={"outlined"}
            style={{width: 300, marginBottom: '10px'}}
            onClick={handleOnSaveClock()}>Save</Button>;
    }

    return (
        <AppDialog
            open={props.show}
            title={<Typography
                style={{fontWeight: 'bold'}}>
                {props.mode} clock
            </Typography>}
            content={getContent()}
            onClose={props.onClose}
            actions={getActions()}/>
    );
}
