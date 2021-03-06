import React from 'react';
import Button from '@material-ui/core/Button';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { AppStateRepository } from "../../state-stores/tasks/app-state-repository";
import AppDialog from "../common/app-dialog";

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

            <AppDialog
                open={open}
                title={
                    <span style={{fontWeight: 'bold'}}>Clear app data</span>}
                content={
                    <span>
                        This will delete your existing tasks data and start app as fresh.
                    </span>}
                actions={
                    <div>
                        <Button autoFocus onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleClearAppState} color="secondary">
                            Clear app data
                        </Button>
                    </div>}
                onClose={handleClose}/>
        </div>
    );
}
