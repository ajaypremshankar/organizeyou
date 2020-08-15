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
import { initSyncStorageListener } from "../../utils/browser-app-state-utils";
import CenterGrid from "./center-grid";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperLeft: {
            height: '48vh',
            width: '22vw',
            textAlign: 'left'
        }
    }),
);

export default function LeftGrid() {
    const classes = useStyles();

    const leftWidgets: JSX.Element[] = [
        <LeftMenuWidget/>
    ]

    return (
        <Grid item xs={3}>
            {[0, 1].map((value) => (<Grid container justify="center">
                <Grid key={1} item>
                    <Paper className={classes.paperLeft} elevation={0}>
                        {leftWidgets[value]}
                    </Paper>
                </Grid>
            </Grid>))}
        </Grid>);
}
