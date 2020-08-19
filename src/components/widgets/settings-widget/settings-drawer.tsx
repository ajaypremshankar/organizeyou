import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import SettingsList from "./settings-list";
import { SettingsType } from "../../../types/types";
import { SettingsStateStore } from "../../../types/settings-state";

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
        <React.Fragment key={'right'}>
            <SwipeableDrawer
                ModalProps={{
                    BackdropProps: {
                        classes: {
                            root: classes.BackdropProps
                        }
                    }
                }}
                anchor={'right'}
                open={props.open}
                onClose={props.toggleDrawer(false)}
                onOpen={props.toggleDrawer(true)}>
                <div
                    style={{background: !SettingsStateStore.isEnabled(SettingsType.BACKGROUND_MODE) ? `rgba(0, 0, 0, 0)` : `rgba(0, 0, 0, 0.3)`}}
                    role="presentation">
                    <SettingsList/>
                </div>
            </SwipeableDrawer>
        </React.Fragment>
    );
}
