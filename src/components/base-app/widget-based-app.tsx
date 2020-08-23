import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { initSyncStorageListener } from "../../state-stores/tasks/app-state-facade-utils";
import { StateStore } from "../../state-stores/tasks/state-store";
import { BaseTasksState } from "../../state-stores/tasks/base-tasks-state";
import CenterGrid from "./center-grid";
import LeftGrid from "./left-grid";
import RightGrid from "./right-grid";
import { getRootPaperStyle, getTheme } from "../../utils/theme-utils";
import { SettingsStateStore } from "../../state-stores/settings/settings-state";
import AppLoader from "../common/app-loader";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 0,
            width: '99vw',
            height: '99vh',
            overflow: 'overlay',
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
        StateStore.loadState()
        initSyncStorageListener()
    }, [])

    useEffect(() => {
        SettingsStateStore.loadState()
    }, [])

    useEffect(() => {
        const pendingTasksCount = StateStore.pendingTasksCount()
        document.title = `(${pendingTasksCount}) ${pendingTasksCount === 1 ? 'task' : 'tasks'} pending`
    }, [baseState, baseState.tasks])

    return (
        <ThemeProvider theme={getTheme()}>
            <Paper style={getRootPaperStyle()} elevation={0}>
                <AppLoader/>
                <Grid container className={classes.root}>
                    <LeftGrid key={`left-grid`}/>
                    <CenterGrid key={`center-grid`}/>
                    <RightGrid key={`right-grid`}/>
                </Grid>
            </Paper>
        </ThemeProvider>
    );
}