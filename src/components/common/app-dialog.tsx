import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SettingsStateService, SettingsType } from "../../state-stores/settings/settings-state";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { AppComponent } from "../../types/ui-types";

interface AppDialogProps {
    open: boolean
    title: AppComponent
    content: AppComponent
    actions: AppComponent
    onClose: any
}

export default function AppDialog(props: AppDialogProps) {

    const defaultMaterialTheme = createMuiTheme({
        overrides: {
            MuiPaper: {
                root: {
                    opacity: SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? 0.8 : 1,
                }
            }
        },
        palette: {
            type: SettingsStateService.isEnabled(SettingsType.DARK_THEME) && !SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? 'dark' : 'light',
            primary: {
                main: SettingsStateService.isEnabled(SettingsType.DARK_THEME) && !SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? '#FFFF' : '#1976d2',
            },
        },

    });

    return (
        <ThemeProvider theme={defaultMaterialTheme}>
            <Dialog
                open={props.open}
                onClose={props.onClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{props.title.element}</DialogTitle>
                <DialogContent>
                    {props.content.element}
                </DialogContent>
                <DialogActions style={props.actions.style}>
                    {props.actions.element}
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
