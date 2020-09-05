import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { getTransparentBackgroundColor } from "../../../utils/theme-utils";
import { SettingsStateService, SettingsType } from "../../../state-stores/settings/settings-state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '15px'
        },
        paperLeft: {
            height: '24wh',
            width: '22vw',
            textAlign: 'left'
        }
    }),
);

export default function LeftGrid() {
    const classes = useStyles();

    useEffect(() => {

    }, []);

    const leftWidgets: JSX.Element[] = []

    return (
        <Grid item key={`left-grid-item`} className={classes.root}>
            <div
                style={{background: getTransparentBackgroundColor(SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE), 0.5)}}>
                {[0, 1, 2, 3].map((value) => (
                    <Grid key={`left-grid-container-${value}`} container justify="center">
                        <Grid key={`left-grid-item-${value}`} item>
                            <Paper key={`left-grid-paper-${value}`} className={classes.paperLeft} elevation={2}>
                                {leftWidgets[value]}
                            </Paper>
                        </Grid>
                    </Grid>))}
            </div>
        </Grid>);
}