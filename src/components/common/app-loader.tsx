import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { SettingsStateStore, SettingsType } from "../../state-stores/settings/settings-state";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
    }),
);

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AppLoader() {
    const classes = useStyles();
    return (
        <div>
            <Backdrop
                className={classes.backdrop}
                open={SettingsStateStore.isEnabled(SettingsType.APP_LOADING)}>
                <CircularProgress color="inherit"/>
            </Backdrop>

            <Snackbar open={SettingsStateStore.isEnabled(SettingsType.APP_LOADING)} autoHideDuration={6000}>
                <Alert severity="info">
                    Initializing app state
                </Alert>
            </Snackbar>
        </div>
    );
}
