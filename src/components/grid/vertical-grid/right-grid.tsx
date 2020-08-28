import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SettingsMenuWidget from "../../widgets/settings-widget/settings-menu-widget";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paperRight: {
            height: '48vh',
            width: '22vw',
            textAlign: 'right'
        }
    }),
);

export default function RightGrid() {
    const classes = useStyles();

    const rightGrid: JSX.Element[] = [
        <SettingsMenuWidget/>
    ]
    return (
        <Grid item xs={3} key={`right-grid-item`}>
            {[0, 1].map((value) => (
                <Grid key={`right-grid-container-${value}`} container justify="center">
                    <Grid key={`right-grid-item-${value}`} item>
                        <Paper key={`right-grid-paper-${value}`} className={classes.paperRight} elevation={0}>
                            {rightGrid[value]}
                        </Paper>
                    </Grid>
                </Grid>))}
        </Grid>);
}