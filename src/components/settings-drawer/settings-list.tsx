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
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from '@material-ui/core/Button';
import BookmarkIcon from '@material-ui/icons/Bookmark';

const useStyles = makeStyles({
    listItemReleased: {
        width: '100%',
        margin: 'auto',
        marginBottom: '5px'
    },
});

interface SettingsListProps {
    settings: Map<SettingsType, boolean>
    handleToggle: (type: SettingsType) => void
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
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><QueryBuilderIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.SHOW_SECONDS}
                    primary={SettingsType.SHOW_SECONDS}/>
                <ListItemSecondaryAction>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => props.handleToggle(SettingsType.SHOW_SECONDS)}
                        checked={props.settings.get(SettingsType.SHOW_SECONDS)}
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
                        onChange={() => props.handleToggle(SettingsType.SHOW_AM_PM)}
                        checked={props.settings.get(SettingsType.SHOW_AM_PM)}
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
                        onChange={() => props.handleToggle(SettingsType.SHOW_ALL_TASKS)}
                        checked={props.settings.get(SettingsType.SHOW_ALL_TASKS)}
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
                        onChange={() => props.handleToggle(SettingsType.DARK_THEME)}
                        checked={props.settings.get(SettingsType.DARK_THEME)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.DARK_THEME}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><BookmarkIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.SHOW_BOOKMARKS}
                    primary={SettingsType.SHOW_BOOKMARKS}/>
                <ListItemSecondaryAction>
                    <Switch
                        color={'primary'}
                        edge="end"
                        onChange={() => props.handleToggle(SettingsType.SHOW_BOOKMARKS)}
                        checked={props.settings.get(SettingsType.SHOW_BOOKMARKS)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.SHOW_BOOKMARKS}`}}
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