import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { SettingsStateService, SettingsType } from "../../../state-stores/settings/settings-state";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import SettingsIcon from "@material-ui/icons/Settings";
import { getTransparentBackgroundColor } from "../../../utils/theme-utils";

const useStyles = makeStyles({
    arrow: {
        opacity: '2.8',
        '&:hover': {
            cursor: 'pointer',
            opacity: '1.0',
        }
    }
});

interface SettingsGearProps {
    toggleDrawer: any
}

export default function SettingsGear(props: SettingsGearProps) {
    const classes = useStyles();

    return (
        <div>
            <ToggleButtonGroup
                style={{background: getTransparentBackgroundColor(SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE), 0.3)}}
                exclusive
                size={"small"}
                orientation="vertical"
                aria-label="text alignment">
                <ToggleButton
                    value={'settings'}
                    className={classes.arrow}
                    onClick={props.toggleDrawer(true)}
                    aria-label="arrow">
                    <Tooltip title="Click to open settings"
                             aria-label="settings-button-tool-tip">
                        <SettingsIcon/>
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
