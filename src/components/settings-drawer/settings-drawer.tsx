import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import SettingsList from "./settings-list";
import {SettingsType} from "../../types/types";
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
    list: {
        width: '100%',
    },
    settingArrowButton: {
        position: 'absolute',
        right: '10px',
        top: '5px'
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
        <Box display="block" width="100%" className={classes.settingArrowButton}>
            <React.Fragment key={'right'}>
                <IconButton
                    className={classes.settingArrowButton}
                    onClick={toggleDrawer(true)}
                    aria-label="arrow" color="primary">
                    <ArrowBackIosIcon/>
                </IconButton>
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
        </Box>
    );
}
