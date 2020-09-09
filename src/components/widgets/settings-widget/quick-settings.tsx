import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Tooltip from "@material-ui/core/Tooltip";
import { SettingsStateService, SettingsType } from "../../../state-stores/settings/settings-state";
import { getTransparentBackgroundColor } from "../../../utils/theme-utils";
import WallpaperIcon from '@material-ui/icons/Wallpaper';

export default function QuickSettings() {

    return (
        <div>
            <ToggleButtonGroup
                style={{background: getTransparentBackgroundColor(SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE), 0.3)}}
                exclusive
                size={"small"}
                orientation="vertical"
                aria-label="text alignment">
                {SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? <ToggleButton
                    onClick={SettingsStateService.fetchAndSetNewWallpaper}
                    aria-label="left aligned">
                    <Tooltip title={'Next wallpaper'}><WallpaperIcon/></Tooltip>
                </ToggleButton> : null}
            </ToggleButtonGroup>
        </div>
    );
}
