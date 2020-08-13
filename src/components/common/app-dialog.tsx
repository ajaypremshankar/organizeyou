import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

interface AppDialogProps {
    open: boolean
    title: JSX.Element
    content: JSX.Element
    actions: JSX.Element
}

export default function AppDialog(props: AppDialogProps) {
    const [open, setOpen] = React.useState(props.open);

    console.log(props)
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.title}
                    </DialogContentText>
                    {props.content}
                </DialogContent>
                <DialogActions>
                    {props.actions}
                </DialogActions>
            </Dialog>
        </div>
    );
}
