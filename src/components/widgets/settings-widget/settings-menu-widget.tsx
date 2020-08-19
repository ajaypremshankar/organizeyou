import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { isFirefox } from "react-device-detect";
import NavigationLinks from "./browser-navigate-links";
import AppMode from "./app-mode-toggle";
import SettingsDrawer from "./settings-drawer";
import SettingsGear from "./settings-gear";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > *': {
                marginTop: theme.spacing(2),
            },
        },
    }),
);

interface LeftMenuWidgetProps {

}

export default function SettingsMenuWidget(props: LeftMenuWidgetProps) {

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
        <div className={classes.root}>
            {!drawerState && <SettingsGear toggleDrawer={toggleDrawer}/>}
            <SettingsDrawer open={drawerState} toggleDrawer={toggleDrawer}/>
            {!drawerState && <AppMode/>}
            {!drawerState && !isFirefox && <NavigationLinks/>}
        </div>
    )
}
