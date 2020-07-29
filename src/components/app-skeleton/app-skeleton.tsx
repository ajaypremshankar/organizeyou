import React, {useState} from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
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
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);

export default function AppSkeleton() {
    const classes = useStyles();

    const userSettings = new UserSettings(true, false)
    const [appSkeletonState, setAppSkeletonState] = useState({
            view: <BaseApp userSettings={userSettings}/>,
            settings: userSettings
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

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Organize You
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}>
                <Toolbar />
                <div className={classes.drawerContainer}>
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
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar />
                {appSkeletonState.view}
            </main>
        </div>
    );
}
