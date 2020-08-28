import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { AppStateService } from "../../state-stores/tasks/app-state-service";
import { TasksState } from "../../state-stores/tasks/tasks-state";
import CenterGrid from "./center-grid";
import LeftGrid from "./left-grid";
import RightGrid from "./right-grid";
import { getRootPaperStyle, getTheme } from "../../utils/theme-utils";
import { SettingsStateService } from "../../state-stores/settings/settings-state";
import AppLoader from "../common/app-loader";
import { AppStateRepository } from "../../state-stores/tasks/app-state-repository";

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
        TasksState.emptyState()
    )

    const [settingsState, setSettingsState] = useState(
        SettingsStateService.emptyState()
    )

    AppStateService.initStore(baseState, setBaseState)
    SettingsStateService.initStore(settingsState, setSettingsState)

    useEffect(() => {
        AppStateService.loadState()
        AppStateRepository.initSyncStorageListener()
    }, [])

    useEffect(() => {
        SettingsStateService.loadState()
    }, [])

    useEffect(() => {
        const pendingTasksCount = AppStateService.pendingTasksCount()
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