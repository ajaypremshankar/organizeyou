import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import {UserSettings} from "../../types/user-settings";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: 'auto',
            maxWidth: 600,
            alignItems: 'left',
            '& > *': {
                margin: theme.spacing(4),
            },
        },
        fullWidth: {
            width: '100%'
        },
        title: {
            margin: theme.spacing(4, 0, 2),
        },
    }),
);

interface UserSettingsProps {
    userSettings: UserSettings
    updateSettings: (userSettings: UserSettings) => void
}

export default function UserSettingsView(props: UserSettingsProps) {
    const classes = useStyles();

    const handleToggle = (type: string) => {
        if (type === 'rememberSelectedDate') {
            props.updateSettings(new UserSettings(!props.userSettings.rememberSelectedDate, props.userSettings.neverSignIn))
        } else if (type === 'neverSignIn') {
            props.updateSettings(new UserSettings(props.userSettings.rememberSelectedDate, !props.userSettings.neverSignIn))
        }
    }

    return (
        <List subheader={<ListSubheader>
            <Typography variant="h6" className={classes.title}>
                Settings
            </Typography>
        </ListSubheader>} className={classes.root}>
            <ListItem>
                <ListItemText id="switch-list-label-remember-selected-date" primary="Remember Selected Date"/>
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={() => handleToggle('rememberSelectedDate')}
                        checked={props.userSettings.rememberSelectedDate}
                        inputProps={{'aria-labelledby': 'switch-list-label-remember-selected-date'}}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText
                    id="switch-list-label-never-sign-in"
                    primary="Never Sign in"
                    secondary="Keep me local forever"/>
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        onChange={() => handleToggle('neverSignIn')}
                        checked={props.userSettings.neverSignIn}
                        inputProps={{'aria-labelledby': 'switch-list-label-never-sign-in'}}
                    />
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    );
}
