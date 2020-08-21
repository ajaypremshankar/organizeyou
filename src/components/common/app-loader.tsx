import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { SettingsStateStore, SettingsType } from "../../state-stores/settings/settings-state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);

export default function AppLoader() {
    const classes = useStyles();
    return (
        <div>
            <Backdrop className={classes.backdrop} open={SettingsStateStore.isEnabled(SettingsType.APP_LOADING)}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
