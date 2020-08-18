import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import SettingsList from "./settings-list";
import Tooltip from '@material-ui/core/Tooltip';
import { StateStore } from "../../types/state-store";
import { SettingsType } from "../../types/types";

const useStyles = makeStyles({
    list: {
        width: '25vw',
        minWidth: '300px',
    },
    settingsBox: {
        position: 'fixed',
        top: '0px',
        opacity: '0.6',
    },
    BackdropProps: {
        background: 'transparent'
    },
    arrow: {
        position: 'fixed',
        right: '30px',
        top: '40px',
        opacity: '0.4',
        '&:hover': {
            cursor: 'pointer',
            opacity: '1.0',
        }
    }
});

interface SettingsDrawerProps {

}

export default function SettingsDrawer(props: SettingsDrawerProps) {
    const classes = useStyles();
    const [drawerState, setDrawerState] = React.useState(false);

    const toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawerState(open);
    };

    return (
            <React.Fragment key={'right'}>
                <Tooltip title="Click to open settings"
                         aria-label="settings-button-tool-tip">
                <IconButton
                    className={classes.arrow}
                    onClick={toggleDrawer(true)}
                    aria-label="arrow" color="primary">
                    <ArrowBackIosIcon/>
                </IconButton>
                </Tooltip>
                <SwipeableDrawer
                    ModalProps={{
                        BackdropProps:{
                            classes:{
                                root:classes.BackdropProps
                            }
                        }
                    }}
                    //className={classes.list}
                    anchor={'right'}
                    open={drawerState}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}>
                    <div
                        style={{background: !StateStore.isSetting(SettingsType.BACKGROUND_MODE) ? `rgba(0, 0, 0, 0)` : `rgba(0, 0, 0, 0.3)`}}
                        className={clsx(classes.list)}
                        role="presentation">
                        <SettingsList />
                    </div>
                </SwipeableDrawer>
            </React.Fragment>
    );
}
