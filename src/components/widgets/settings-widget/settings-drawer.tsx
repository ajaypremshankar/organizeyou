import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import SettingsList from "./settings-list";
import { SettingsStateStore, SettingsType } from "../../../state-stores/settings/settings-state";
import { getTransparentBackgroundColor } from "../../../utils/theme-utils";

const useStyles = makeStyles({
    list: {
        width: '25vw',
        minWidth: '300px',
    },
    settingsBox: {
        opacity: '0.6',
    },
    BackdropProps: {
        background: 'transparent'
    },
});

interface SettingsDrawerProps {
    open: boolean,
    toggleDrawer: any
}

export default function SettingsDrawer(props: SettingsDrawerProps) {
    const classes = useStyles();

    return (
            <SwipeableDrawer
                ModalProps={{
                    BackdropProps: {
                        classes: {
                            root: classes.BackdropProps
                        }
                    }
                }}

                PaperProps={{
                    style: {width: '27%'}
                }}
                anchor={'right'}
                open={props.open}
                onClose={props.toggleDrawer(false)}
                onOpen={props.toggleDrawer(true)}>
                <div
                    style={{background: getTransparentBackgroundColor(SettingsStateStore.isEnabled(SettingsType.BACKGROUND_MODE), 0.3)}}
                    role="presentation">
                    <SettingsList/>
                </div>
            </SwipeableDrawer>
    );
}
