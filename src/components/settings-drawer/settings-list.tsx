import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { SettingsType } from "../../types/types";
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import SettingsIcon from "@material-ui/icons/Settings";
import { Divider } from "@material-ui/core";
import AboutUs from "./about-us";
import PaletteIcon from '@material-ui/icons/Palette';
import { StateStore } from "../../types/state-store";
import ImageIcon from '@material-ui/icons/Image';

const useStyles = makeStyles({
    listItemReleased: {
        width: '100%',
        margin: 'auto',
        marginBottom: '5px'
    },
});

interface SettingsListProps {
}

export default function SettingsList(props: SettingsListProps) {
    const classes = useStyles();
    return (
        <List className={classes.listItemReleased}>
            <ListItem color={'primary'} className={classes.listItemReleased}>
                <ListItemIcon><SettingsIcon/></ListItemIcon>
                <ListItemText primary={'Settings'}/>
            </ListItem>
            <Divider/>
            <ListItem className={classes.listItemReleased} style={{display: 'none'}}>
                <ListItemIcon><QueryBuilderIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.SHOW_SECONDS}
                    primary={SettingsType.SHOW_SECONDS}/>
                <ListItemSecondaryAction style={{display: 'none'}}>
                    <Switch
                        style={{display: 'none'}}
                        color={'primary'}
                        edge="end"
                        onChange={() => StateStore.handleSettingsToggle(SettingsType.SHOW_SECONDS)}
                        checked={StateStore.isSetting(SettingsType.SHOW_SECONDS)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.SHOW_SECONDS}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><QueryBuilderIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.SHOW_AM_PM}
                    primary={SettingsType.SHOW_AM_PM}/>
                <ListItemSecondaryAction>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => StateStore.handleSettingsToggle(SettingsType.SHOW_AM_PM)}
                        checked={StateStore.isSetting(SettingsType.SHOW_AM_PM)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.SHOW_AM_PM}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>

            <ListItem className={classes.listItemReleased} style={{display: 'none'}}>
                <ListItemIcon><FormatListBulletedIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.SHOW_ALL_TASKS}
                    primary={SettingsType.SHOW_ALL_TASKS}/>
                <ListItemSecondaryAction style={{display: 'none'}}>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => StateStore.handleSettingsToggle(SettingsType.SHOW_ALL_TASKS)}
                        checked={StateStore.isSetting(SettingsType.SHOW_ALL_TASKS)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.SHOW_ALL_TASKS}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><PaletteIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.DARK_THEME}
                    primary={SettingsType.DARK_THEME}/>
                <ListItemSecondaryAction>
                    <Switch
                        color={'primary'}
                        edge="end"
                        disabled={StateStore.isSetting(SettingsType.BACKGROUND_MODE)}
                        onChange={() => StateStore.handleSettingsToggle(SettingsType.DARK_THEME)}
                        checked={StateStore.isSetting(SettingsType.DARK_THEME)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.DARK_THEME}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><ImageIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.BACKGROUND_MODE}
                    primary={SettingsType.BACKGROUND_MODE}/>
                <ListItemSecondaryAction>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => StateStore.handleSettingsToggle(SettingsType.BACKGROUND_MODE)}
                        checked={StateStore.isSetting(SettingsType.BACKGROUND_MODE)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.BACKGROUND_MODE}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem className={classes.listItemReleased}>
                <ListItemText
                    id={SettingsType.ABOUT_US}
                    primary={<AboutUs/>}
                />
            </ListItem>
        </List>);
}