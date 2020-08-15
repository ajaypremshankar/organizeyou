import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

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

    return (
        <Grid item xs={3}>
            {[0, 1].map((value) => (<Grid container justify="center">
                <Grid key={1} item>
                    <Paper className={classes.paperRight} elevation={0}>
                    </Paper>
                </Grid>
            </Grid>))}
        </Grid>);
}
