import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AddTaskWidget from "../widgets/add-task/add-task-widget";
import CenterMenuWidget from "../widgets/top-menu/center-menu-widget";
import TaskListWidget from "../widgets/task-list/task-list-widget";
import SearchBarWidget from "../widgets/search-bar/search-bar-widget";
import { SettingsStateStore, SettingsType } from "../../state-stores/settings/settings-state";
import { getTransparentBackgroundColor } from "../../utils/theme-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '15px'
        },
        paperCenter: {
            height: '100%',
            width: '48vw',
            background: 'transparent',
            boxShadow: 'none',
        },
    }),
);

export default function CenterGrid() {
    const classes = useStyles();

    const centerWidgets: JSX.Element[] = [
        <CenterMenuWidget />,
        SettingsStateStore.isFullMode() ? <AddTaskWidget showDaySelect={true}/> : <SearchBarWidget/>,
        SettingsStateStore.isFullMode() ? <TaskListWidget showCompleted={true}/> : <span></span>,
    ]

    return (

        <Grid item xs={6} key={`center-grid-item`} className={classes.root}>
            <div style={{background: getTransparentBackgroundColor(SettingsStateStore.isEnabled(SettingsType.BACKGROUND_MODE), 0.3)}}>
            {[0, 1, 2, 3].map((value) => (<Grid key={`center-grid-container-${value}`} container justify="center">
                <Grid key={`center-grid-item-${value}`} item>
                    <div>
                        <Paper key={`center-grid-paper-${value}`} className={classes.paperCenter}
                               elevation={0}>
                            {centerWidgets[value]}
                        </Paper>
                    </div>
                </Grid>
            </Grid>))}
            </div>
        </Grid>
    );
}