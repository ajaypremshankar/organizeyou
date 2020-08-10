import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import SettingsList from "./settings-list";
import { SettingsType } from "../../types/types";
import Tooltip from '@material-ui/core/Tooltip';

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
    settings: Map<SettingsType, boolean>
    handleSettingsToggle: (type: SettingsType) => void
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
                    className={classes.list}
                    anchor={'right'}
                    open={drawerState}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}>
                    <div
                        className={clsx(classes.list)}
                        role="presentation">
                        <SettingsList handleToggle={props.handleSettingsToggle} settings={props.settings}/>
                    </div>
                </SwipeableDrawer>
            </React.Fragment>
    );
}
