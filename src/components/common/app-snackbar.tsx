import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
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

interface AppSnackbarProps {
    type: 'success' | 'info' | 'warning' | 'error'
    message: string
    open: boolean
    autoHideDuration?: 600
}

export default function AppSnackbar(props: AppSnackbarProps) {
    const classes = useStyles();
    return (
        <Snackbar open={props.open} autoHideDuration={props.autoHideDuration}>
            <Alert severity={props.type}>
                {props.message}
            </Alert>
        </Snackbar>
    );
}
