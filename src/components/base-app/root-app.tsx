import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { AppStateService } from "../../state-stores/tasks/app-state-service";
import { TasksState } from "../../state-stores/tasks/tasks-state";
import { getRootPaperStyle, getTheme } from "../../utils/theme-utils";
import { SettingsStateService } from "../../state-stores/settings/settings-state";
import AppLoader from "../common/app-loader";
import { AppStateRepository } from "../../state-stores/tasks/app-state-repository";
import VerticalGrid from "../grid/vertical-grid/vertical-grid";
import { TaskTemplateState } from "../../state-stores/task-template/task-template-state";
import { TaskTemplateStateService } from "../../state-stores/task-template/task-template-state-service";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({}),
);

export default function RootApp() {
    const classes = useStyles();
    const [baseState, setBaseState] = useState(
        TasksState.emptyState()
    )

    const [settingsState, setSettingsState] = useState(
        SettingsStateService.emptyState()
    )

    const [templateState, setTemplateState] = useState(
        TaskTemplateState.emptyState()
    )

    AppStateService.initStore(baseState, setBaseState)
    SettingsStateService.initStore(settingsState, setSettingsState)
    TaskTemplateStateService.initStore(templateState, setTemplateState)

    useEffect(() => {
        AppStateService.loadState()
        AppStateRepository.initSyncStorageListener()
    }, [])

    useEffect(() => {
        SettingsStateService.loadState()
    }, [])

    useEffect(() => {
        TaskTemplateStateService.loadState()
    }, [])

    useEffect(() => {
        const pendingTasksCount = AppStateService.pendingTasksCount()
        document.title = `(${pendingTasksCount}) ${pendingTasksCount === 1 ? 'task' : 'tasks'} pending`
    }, [baseState, baseState.tasks])

    return (
        <ThemeProvider theme={getTheme()}>
            <Paper style={getRootPaperStyle()} elevation={0}>
                <AppLoader/>
                <VerticalGrid/>
            </Paper>
        </ThemeProvider>
    );
}