import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { StateStore } from "../../types/state-store";
import AddTaskWidget from "../widgets/add-task/add-task-widget";
import CenterMenuWidget from "../widgets/top-menu/center-menu-widget";
import TaskListWidget from "../widgets/task-list/task-list-widget";
import SearchBarWidget from "../widgets/search-bar/search-bar-widget";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperCenter: {
            height: '100%',
            width: '48vw',
        },
    }),
);

export default function CenterGrid() {
    const classes = useStyles();

    const centerWidgets: JSX.Element[] = [
        <CenterMenuWidget settings={StateStore.getSettings()}/>,
        StateStore.isFullMode() ? <AddTaskWidget
            keyTitle={StateStore.getKeyTitle()}
            changeSelectedDate={StateStore.updateCurrentlySelectedDate}
            addTask={StateStore.handleTaskAddition}/> : <SearchBarWidget/>,
        StateStore.isFullMode() ? <TaskListWidget showCompleted={true}/> : <span></span>,
    ]

    return (
        <Grid item xs={6} key={`center-grid-item`}>
            {[0, 1, 2, 3].map((value) => (<Grid key={`center-grid-container-${value}`} container justify="center">
                <Grid key={`center-grid-item-${value}`} item>
                    <Paper key={`center-grid-paper-${value}`} className={classes.paperCenter}
                           elevation={0}>
                        {centerWidgets[value]}
                    </Paper>
                </Grid>
            </Grid>))}
        </Grid>);
}