import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import LeftMenuWidget from "../widgets/top-menu/left-menu-widget";

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
        <Grid item xs={3} key={`left-grid-item`}>
            {[0, 1].map((value) => (<Grid key={`left-grid-container-${value}`} container justify="center">
                <Grid key={`left-grid-item-${value}`} item>
                    <Paper key={`left-grid-paper-${value}`} className={classes.paperLeft} elevation={0}>
                        {leftWidgets[value]}
                    </Paper>
                </Grid>
            </Grid>))}
        </Grid>);
}