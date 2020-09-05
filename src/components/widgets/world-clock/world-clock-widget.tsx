import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Clock from "./clock";
import { SettingsStateService, SettingsType } from "../../../state-stores/settings/settings-state";
import WorldClockSetting, { WorldClock } from "./work-clock-setting";
import moment from "moment-timezone";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: '20px',
        },
        paperCenter: {
            height: '100%',
            verticalAlign: 'middle'
        },
        control: {
            padding: theme.spacing(2),
        },
    }),
);

const useStylesClock = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '-30px',
        },
        title: {
            fontSize: SettingsStateService.isFullMode() ? '10px' : '15px',
            letterSpacing: SettingsStateService.isFullMode() ? '1px' : '1px',
            opacity: '50%',
        },
        clock: {
            letterSpacing: SettingsStateService.isFullMode() ? '1px' : '1px',
            fontSize: SettingsStateService.isFullMode() ? '1.5em' : '3em',
            fontWeight: 500,
            marginBottom: SettingsStateService.isFullMode() ? '0px' : '-10px',
        },
        date: {
            fontWeight: 400,
            letterSpacing: SettingsStateService.isFullMode() ? '1px' : '-1px',
            fontSize: SettingsStateService.isFullMode() ? '.7em' : '1em',
            marginBottom: SettingsStateService.isFullMode() ? '20px' : '40px',
        },
        arrow: {
            position: 'relative',
            verticalAlign: 'middle',
            margin: '5px 5px',
            opacity: '0.1',
            '&:hover': {
                cursor: 'pointer',
                opacity: '1.0',
            }
        }
    }),
);

const useStylesClockCenter = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '-20px',
        },
        title: {
            fontSize: SettingsStateService.isFullMode() ? '10px' : '15px',
            letterSpacing: SettingsStateService.isFullMode() ? '1px' : '1px',
            marginBottom: SettingsStateService.isFullMode() ? '-30px' : '-20px',
            opacity: '50%',
        },
        clock: {
            letterSpacing: SettingsStateService.isFullMode() ? '-1px' : '2px',
            fontSize: SettingsStateService.isFullMode() ? '5em' : '7em',
            fontWeight: 500,
            marginBottom: SettingsStateService.isFullMode() ? '-10px' : '-20px',
            marginTop: SettingsStateService.isFullMode() ? '-10px' : '-20px',
        },
        date: {
            fontWeight: 400,
            letterSpacing: SettingsStateService.isFullMode() ? '1px' : '-1px',
            fontSize: SettingsStateService.isFullMode() ? '1em' : '2em',
            marginBottom: SettingsStateService.isFullMode() ? '10px' : '40px',
        },
        arrow: {
            verticalAlign: 'middle',
            margin: '5px 5px',
            opacity: '0.1',
            '&:hover': {
                cursor: 'pointer',
                opacity: '1.0',
            }
        }
    }),
);

export default function WorldClockWidget() {
    const classes = useStyles();
    const defaultClock: WorldClock = {
        id: 1,
        title: moment.tz.guess(),
        timezone: moment.tz.guess(),
        ampmEnabled: true,
    }
    const [clockDialogState, setClockDialogState] = useState({
        open: false,
        current: defaultClock
    })

    const loadEditClockDialog = (clock: WorldClock) => {
        setClockDialogState({
            ...clockDialogState,
            current: clock,
            open: true
        })
    }

    const closeEditClockDialog = () => {
        setClockDialogState({
            ...clockDialogState,
            open: false
        })
    }

    const saveClock = (clock: WorldClock) => {

        const newClockArr = SettingsStateService.getWorldClockData()
        newClockArr[clock.id] = clock

        SettingsStateService.updateObjectSetting(SettingsType.WORLD_CLOCK_DATA, newClockArr)

        setClockDialogState({
            ...clockDialogState,
            open: false
        })
    }

    const all = SettingsStateService.getWorldClockData()

    const clockComponentList: JSX.Element[] = [
        <Clock
            useStyle={useStylesClock}
            onOpen={loadEditClockDialog}
            data={all[0]}/>,
        <Clock
            useStyle={useStylesClockCenter}
            onOpen={loadEditClockDialog}
            data={all[1]}/>,
        <Clock
            useStyle={useStylesClock}
            onOpen={loadEditClockDialog}
            data={all[2]}/>,
    ]

    return (
        <div className={classes.root}>
            {clockDialogState.open
            && <WorldClockSetting
                show={clockDialogState.open}
                onClose={closeEditClockDialog}
                data={clockDialogState.current}
                onSave={saveClock}
                mode={'Edit'}/>}
            {SettingsStateService.isFullMode() ? <Grid item xs={12} key={`world-clock-grid-item`}>
                <Grid container alignItems="center" justify="center" direction="row">
                    {SettingsStateService.isEnabled(SettingsType.SHOW_WORLD_CLOCK) ?
                        <Grid xs={3} key={`world-clock-grid-item-0`} item>
                            <Paper key={`world-clock-grid-paper-0`} className={classes.paperCenter} elevation={0}>
                                {clockComponentList[0]}
                            </Paper>
                        </Grid> : null}
                    <Grid xs={5} key={`world-clock-grid-item-1`} item>
                        <Paper key={`world-clock-grid-paper-1`} className={classes.paperCenter} elevation={0}>
                            {clockComponentList[1]}
                        </Paper>
                    </Grid>
                    {SettingsStateService.isEnabled(SettingsType.SHOW_WORLD_CLOCK) ?
                        <Grid xs={3} key={`world-clock-grid-item-2`} item>
                            <Paper key={`world-clock-grid-paper-2`} className={classes.paperCenter} elevation={0}>
                                {clockComponentList[2]}
                            </Paper>
                        </Grid> : null}
                </Grid>
            </Grid> : <Grid item xs={12} key={`world-clock-grid-item`}>
                <Grid container alignItems="center" justify="center" direction="row">
                    <Grid xs={12} key={`world-clock-grid-item-1`} item>
                        <Paper key={`world-clock-grid-paper-1`} className={classes.paperCenter} elevation={0}>
                            {clockComponentList[1]}
                        </Paper>
                    </Grid>
                </Grid>
                {SettingsStateService.isEnabled(SettingsType.SHOW_WORLD_CLOCK) ?
                    <Grid container alignItems="center" justify="center" direction="row">
                        <Grid xs={6} key={`world-clock-grid-item-0`} item>
                            <Paper key={`world-clock-grid-paper-0`} className={classes.paperCenter} elevation={0}>
                                {clockComponentList[0]}
                            </Paper>
                        </Grid>
                        <Grid xs={6} key={`world-clock-grid-item-2`} item>
                            <Paper key={`world-clock-grid-paper-2`} className={classes.paperCenter} elevation={0}>
                                {clockComponentList[2]}
                            </Paper>
                        </Grid>
                    </Grid> : null}
            </Grid>}
        </div>);
}
