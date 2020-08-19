import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { loadAppState } from "../../utils/app-state-facade-utils";
import { StateStore } from "../../types/state-store";
import { BaseTasksState } from "../../types/base-tasks-state";
import { initSyncStorageListener } from "../../utils/browser-app-state-utils";
import CenterGrid from "./center-grid";
import LeftGrid from "./left-grid";
import RightGrid from "./right-grid";
import { getRootPaperStyle, getTheme } from "../../utils/theme-utils";
import { SettingsStateStore } from "../../types/settings-state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 0,
            width: '100vw',
            height: '100vh',
        }
    }),
);

export default function WidgetBasedApp() {
    const classes = useStyles();

    const [baseState, setBaseState] = useState(
        BaseTasksState.emptyState()
    )

    const [settingsState, setSettingsState] = useState(
        SettingsStateStore.emptyState()
    )

    StateStore.initStore(baseState, setBaseState)
    SettingsStateStore.initStore(settingsState, setSettingsState)

    useEffect(() => {
        loadAppState().then(value => {
            StateStore.setToStore(value)
        })
        initSyncStorageListener()
    }, [])

    useEffect(() => {
        SettingsStateStore.loadState()
        SettingsStateStore.setIfNotTodayImageUrl()
    }, [])

    useEffect(() => {
        const pendingTasksCount = StateStore.pendingTasksCount()
        document.title = `(${pendingTasksCount}) ${pendingTasksCount === 1 ? 'task' : 'tasks'} pending`
    }, [baseState, baseState.tasks])

    return (
        <ThemeProvider theme={getTheme()}>
            <Paper style={getRootPaperStyle()} elevation={0}>
                <Grid container className={classes.root}>
                    <LeftGrid key={`left-grid`}/>
                    <CenterGrid key={`center-grid`}/>
                    <RightGrid key={`right-grid`}/>
                </Grid>
            </Paper>
        </ThemeProvider>
    );
}