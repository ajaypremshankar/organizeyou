import React, {useState} from 'react';
import {createStyles, Theme, makeStyles, useTheme} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import SettingsIcon from '@material-ui/icons/Settings';
import BaseApp from "../base-app/base-app";
import UserSettingsView from "../settings-list/user-settings";
import {UserSettings} from "../../types/user-settings";
import HomeIcon from '@material-ui/icons/Home';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);

export default function AppSkeleton() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const userSettings = new UserSettings(true, false)
    const [appSkeletonState, setAppSkeletonState] = useState({
            view: <BaseApp userSettings={userSettings}/>,
            settings: userSettings,
        }
    );

    const updateSettings = (settings: UserSettings) => {
        setAppSkeletonState({
            ...appSkeletonState,
            settings: settings
        })
    }

    const renderPage = (page: string) => {

        const settings = appSkeletonState.settings

        if(page === 'settings') {
            setAppSkeletonState({
                ...appSkeletonState,
                view: <UserSettingsView userSettings={settings} updateSettings={updateSettings}/>
            })
        } else if(page === 'home') {
            setAppSkeletonState({
                ...appSkeletonState,
                view: <BaseApp userSettings={settings}/>
            })
        }
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Organize You
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key={'Home'} onClick={() => renderPage('home')}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary={'Home'} />
                    </ListItem>
                    <ListItem button key={'Sign-in'}>
                        <ListItemIcon><PersonAddIcon /></ListItemIcon>
                        <ListItemText primary={'Sign-in'} />
                    </ListItem>
                    <ListItem button key={'Settings'} onClick={() => renderPage('settings')}>
                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                        <ListItemText primary={'Settings'} />
                    </ListItem>

                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {appSkeletonState.view}
            </main>
        </div>
    );
}
