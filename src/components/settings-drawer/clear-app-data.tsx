import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper, { PaperProps } from '@material-ui/core/Paper';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { SettingsStateService, SettingsType } from "../../state-stores/settings/settings-state";
import { getTransparentBackgroundColor } from "../../utils/theme-utils";
import { AppStateRepository } from "../../state-stores/tasks/app-state-repository";

function PaperComponent(props: PaperProps) {
    return (
        <Paper
            style={{background: getTransparentBackgroundColor(SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE), 0.6)}} {...props} />
    );
}

interface ClearAppDataProps {
}

export default function ClearAppData(props: ClearAppDataProps) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClearAppState = () => {
        AppStateRepository.clearAppState()
        handleClose()
    }

    return (
        <div>
            <Button
                startIcon={<ClearAllIcon/>} size={"small"} variant="outlined" color="secondary"
                onClick={handleClickOpen}>
                Clear app data
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title">
                <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                    Clear app data
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will delete your existing tasks data and start app as fresh.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClearAppState} color="secondary">
                        Clear app data
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
