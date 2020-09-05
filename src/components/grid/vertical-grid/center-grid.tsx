import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AddTaskWidget from "../../widgets/add-task/add-task-widget";
import TaskListWidget from "../../widgets/task-list/task-list-widget";
import SearchBarWidget from "../../widgets/search-bar/search-bar-widget";
import { SettingsStateService, SettingsType } from "../../../state-stores/settings/settings-state";
import { getTransparentBackgroundColor } from "../../../utils/theme-utils";
import WorldClockWidget from "../../widgets/world-clock/world-clock-widget";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '15px'
        },
        paperCenter: {
            height: '100%',
            width: '54vw',
            background: 'transparent',
            boxShadow: 'none',
        },
    }),
);

export default function CenterGrid() {
    const classes = useStyles();

    const centerWidgets: JSX.Element[] = [
        <WorldClockWidget/>,
        SettingsStateService.isFullMode() ? <AddTaskWidget showDaySelect={true}/> : <SearchBarWidget/>,
        SettingsStateService.isFullMode() ? <TaskListWidget showCompleted={true}/> : <span></span>,
    ]

    return (

        <Grid item key={`center-grid-item`} className={classes.root}>
            <div style={{background: getTransparentBackgroundColor(SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE), 0.5)}}>
                {[0, 1, 2, 3].map((value) => (
                    <Grid key={`center-grid-container-${value}`} container justify="center">
                        <Grid key={`center-grid-item-${value}`} item>
                            <div>
                                <Paper
                                    key={`center-grid-paper-${value}`}
                                    className={classes.paperCenter}
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