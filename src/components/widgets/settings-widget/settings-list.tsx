import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import SettingsIcon from "@material-ui/icons/Settings";
import { Divider } from "@material-ui/core";
import AboutUs from "../../settings-drawer/about-us";
import PaletteIcon from '@material-ui/icons/Palette';
import ImageIcon from '@material-ui/icons/Image';
import { SettingsStateService, SettingsType } from "../../../state-stores/settings/settings-state";
import Typography from "@material-ui/core/Typography";
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles({
    listItemReleased: {
        width: '100%',
        margin: 'auto',
        marginBottom: '5px',
    },
    title: {
        maxWidth: '70%',
        wordWrap: 'normal',
    },
    secondaryAction: {
        marginRight: '20px'
    }
});

interface SettingsListProps {
}

export default function SettingsList(props: SettingsListProps) {
    const classes = useStyles();
    return (
        <List className={classes.listItemReleased}>
            <ListItem color={'primary'} className={classes.listItemReleased}>
                <ListItemIcon><SettingsIcon/></ListItemIcon>
                <ListItemText
                    primary={<Typography variant="h5" color="primary">
                        Preferences
                    </Typography>}/>
            </ListItem>
            <Divider/>
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><QueryBuilderIcon/></ListItemIcon>
                <ListItemText
                    className={classes.title}
                    id={SettingsType.SHOW_WORLD_CLOCK}
                    primary={SettingsType.SHOW_WORLD_CLOCK}/>
                <ListItemSecondaryAction className={classes.secondaryAction}>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => SettingsStateService.toggleSetting(SettingsType.SHOW_WORLD_CLOCK)}
                        checked={SettingsStateService.isEnabled(SettingsType.SHOW_WORLD_CLOCK)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.SHOW_WORLD_CLOCK}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>

            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><FormatListBulletedIcon/></ListItemIcon>
                <ListItemText
                    className={classes.title}
                    id={SettingsType.SHOW_COMPLETED_TASKS}
                    primary={SettingsType.SHOW_COMPLETED_TASKS}/>
                <ListItemSecondaryAction className={classes.secondaryAction}>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => SettingsStateService.toggleSetting(SettingsType.SHOW_COMPLETED_TASKS)}
                        checked={SettingsStateService.isEnabled(SettingsType.SHOW_COMPLETED_TASKS)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.SHOW_COMPLETED_TASKS}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <Divider/>
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><ImageIcon/></ListItemIcon>
                <ListItemText
                    className={classes.title}
                    id={SettingsType.BACKGROUND_MODE}
                    primary={SettingsType.BACKGROUND_MODE}
                    secondary={'Credits: Unsplash.com'}/>
                <ListItemSecondaryAction className={classes.secondaryAction}>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => SettingsStateService.toggleSetting(SettingsType.BACKGROUND_MODE)}
                        checked={SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.BACKGROUND_MODE}`}}/>
                </ListItemSecondaryAction>
            </ListItem>
            {!SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) &&
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><PaletteIcon/></ListItemIcon>
                <ListItemText
                    className={classes.title}
                    id={SettingsType.DARK_THEME}
                    primary={SettingsType.DARK_THEME}/>
                <ListItemSecondaryAction className={classes.secondaryAction}>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => SettingsStateService.toggleSetting(SettingsType.DARK_THEME)}
                        checked={SettingsStateService.isEnabled(SettingsType.DARK_THEME)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.DARK_THEME}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>}
            {SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) &&
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><LockIcon/></ListItemIcon>
                <ListItemText
                    className={classes.title}
                    id={SettingsType.LOCK_CURRENT_WALLPAPER}
                    primary={SettingsType.LOCK_CURRENT_WALLPAPER}/>
                <ListItemSecondaryAction className={classes.secondaryAction}>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => SettingsStateService.toggleSetting(SettingsType.LOCK_CURRENT_WALLPAPER)}
                        checked={SettingsStateService.isEnabled(SettingsType.LOCK_CURRENT_WALLPAPER)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.LOCK_CURRENT_WALLPAPER}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>}
            <Divider/>
            <ListItem className={classes.listItemReleased}>
                <ListItemText
                    id={SettingsType.ABOUT_US}
                    primary={<AboutUs/>}
                />
            </ListItem>
        </List>);
}