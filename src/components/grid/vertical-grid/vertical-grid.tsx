import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LeftGrid from "./left-grid";
import CenterGrid from "./center-grid";
import RightGrid from "./right-grid";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        '@global': {
            '*::-webkit-scrollbar': {
                width: '12px',
            },
            '*::-webkit-scrollbar-thumb': {
                background: 'lightgray',
            },
            '*::-webkit-scrollbar-track': {
                background: 'transparent',
            }
        },
        root: {
            flexGrow: 0,
            width: '99vw',
            height: '99vh',
            overflow: 'overlay',
        }
    }),
);

export default function VerticalGrid() {
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <LeftGrid key={`left-grid`}/>
            <CenterGrid key={`center-grid`}/>
            <RightGrid key={`right-grid`}/>
        </Grid>
    );
}