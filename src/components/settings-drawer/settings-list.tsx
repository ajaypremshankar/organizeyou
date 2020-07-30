import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {SettingsType} from "../../types/types";
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import DateRangeIcon from '@material-ui/icons/DateRange';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles({
    listItemReleased: {
        width: '100%',
    },

});

interface SettingsListProps {
    settings: Map<SettingsType, boolean>
    handleToggle: (type: SettingsType) => void
}

export default function SettingsList(props: SettingsListProps) {
    const classes = useStyles();

    function showAboutUs() {
        //TODO
    }

    return (
        <List className={classes.listItemReleased}>
            <ListItem button key={'Sign-in'} disabled className={classes.listItemReleased}>
                <ListItemIcon><PersonAddIcon/></ListItemIcon>
                <ListItemText primary={'Sign-in'}/>
            </ListItem>
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><DateRangeIcon/></ListItemIcon>
                <ListItemText id="switch-list-label-remember-selected-date" primary="Remember date"/>
                <ListItemSecondaryAction>
                    <Switch
                        edge="end"
                        color={'primary'}
                        onChange={() => props.handleToggle(SettingsType.REMEMBER_SELECTED_DATE)}
                        checked={props.settings.get(SettingsType.REMEMBER_SELECTED_DATE)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.REMEMBER_SELECTED_DATE}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem className={classes.listItemReleased}>
                <ListItemIcon><QueryBuilderIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.SHOW_SECONDS}
                    primary={SettingsType.SHOW_SECONDS}
                    secondary={`${props.settings.get(SettingsType.SHOW_SECONDS)?'Hides': 'Shows'} seconds in clock`}/>
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
                    primary={SettingsType.SHOW_AM_PM}
                    secondary={`${props.settings.get(SettingsType.SHOW_AM_PM)?'Hides': 'Shows'} AM/PM`}/>
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

            <ListItem className={classes.listItemReleased} disabled>
                <ListItemIcon><FormatListBulletedIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.SHOW_ALL_TASKS}
                    primary={SettingsType.SHOW_ALL_TASKS}
                    secondary={`${props.settings.get(SettingsType.SHOW_ALL_TASKS)?'Hides': 'Shows'} all task list`}/>
                <ListItemSecondaryAction>
                    <Switch
                        disabled
                        color={'primary'}
                        edge="end"
                        onChange={() => props.handleToggle(SettingsType.SHOW_ALL_TASKS)}
                        checked={props.settings.get(SettingsType.SHOW_ALL_TASKS)}
                        inputProps={{'aria-labelledby': `switch-list-label-${SettingsType.SHOW_ALL_TASKS}`}}
                    />
                </ListItemSecondaryAction>
            </ListItem>

            <ListItem  disabled className={classes.listItemReleased}>
                <ListItemIcon><InfoIcon/></ListItemIcon>
                <ListItemText
                    id={SettingsType.ABOUT_US}
                    primary={SettingsType.ABOUT_US}
                />
            </ListItem>

        </List>);
}