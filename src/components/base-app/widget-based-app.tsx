import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { SettingsType } from "../../types/types";
import { loadAppState } from "../../utils/app-state-facade-utils";
import { StateStore } from "../../types/state-store";
import AddTaskWidget from "../widgets/add-task/add-task-widget";
import SettingsDrawer from "../settings-drawer/settings-drawer";
import CenterMenuWidget from "../widgets/top-menu/center-menu-widget";
import TaskListWidget from "../widgets/task-list/task-list-widget";
import LeftMenuWidget from "../widgets/top-menu/left-menu-widget";
import SearchBarWidget from "../widgets/search-bar/search-bar-widget";
import { BaseTasksState } from "../../types/base-tasks-state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 0,
            width: '100vw',
            height: '100vh',
        },
        paperLeft: {
            height: '48vh',
            width: '22vw',
            textAlign: 'left'
        },
        paperRight: {
            height: '48vh',
            width: '22vw',
            textAlign: 'right'
        },
        paperCenter: {
            height: '100%',
            width: '48vw',
        },
    }),
);

export default function WidgetBasedApp() {
    const classes = useStyles();

    const [baseState, setBaseState] = useState(
        BaseTasksState.emptyState()
    )

    StateStore.initStore(baseState, setBaseState)

    useEffect(() => {
        loadAppState().then(value => {
            setBaseState(value)
            StateStore.setToStore(value)
        })
    }, [])

    useEffect(() => {
        const pendingTasksCount = StateStore.pendingTasksCount()
        document.title = `(${pendingTasksCount}) ${pendingTasksCount === 1 ? 'task' : 'tasks'} pending`
    }, [baseState, baseState.tasks])

    const leftWidgets: JSX.Element[] = [
        <LeftMenuWidget/>
    ]

    const centerWidgets: JSX.Element[] = [
        <CenterMenuWidget settings={baseState.settings}/>,
        StateStore.isFullMode() ? <AddTaskWidget
            keyTitle={baseState.getKeyTitle()}
            changeSelectedDate={StateStore.updateCurrentlySelectedDate}
            addTask={StateStore.handleTaskAddition}/> : <SearchBarWidget/>,
        StateStore.isFullMode() ? <TaskListWidget showCompleted={true}/> : <span></span>,
    ]

    const theme = createMuiTheme({
        palette: {
            type: baseState.settings.get(SettingsType.DARK_THEME) ? 'dark' : 'light',
            primary: {
                main: baseState.settings.get(SettingsType.DARK_THEME) ? '#FFFF' : '#1976d2',
            }
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Paper style={{
                width: '100%',
                minHeight: '100%',
                position: 'absolute',
                //background: 'transparent', boxShadow: 'none'
            }} elevation={0}>
                <SettingsDrawer
                    handleSettingsToggle={StateStore.handleSettingsToggle}
                    settings={baseState.settings}/>
                <Grid container className={classes.root}>
                    <Grid item xs={3}>
                        {[0, 1].map((value) => (<Grid container justify="center">
                            <Grid key={1} item>
                                <Paper className={classes.paperLeft} elevation={0}>
                                    {leftWidgets[value]}
                                </Paper>
                            </Grid>
                        </Grid>))}
                    </Grid>
                    <Grid item xs={6}>
                        {[0, 1, 2, 3].map((value) => (<Grid container justify="center">
                            <Grid key={2} item>
                                <Paper className={classes.paperCenter}
                                       elevation={0}>
                                    {centerWidgets[value]}
                                </Paper>
                            </Grid>
                        </Grid>))}
                    </Grid>
                    <Grid item xs={3}>
                        {[0, 1].map((value) => (<Grid container justify="center">
                            <Grid key={1} item>
                                <Paper className={classes.paperRight} elevation={0}>
                                </Paper>
                            </Grid>
                        </Grid>))}
                    </Grid>
                </Grid>
            </Paper>
        </ThemeProvider>
    );
}
