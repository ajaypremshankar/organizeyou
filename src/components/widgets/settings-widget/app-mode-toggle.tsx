import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import SubjectIcon from '@material-ui/icons/Subject';
import Tooltip from "@material-ui/core/Tooltip";
import { SettingsStateStore, SettingsType } from "../../../state-stores/settings/settings-state";
import { getTransparentBackgroundColor } from "../../../utils/theme-utils";

export default function AppMode() {

    return (
        <div>
            <ToggleButtonGroup
                style={{background: getTransparentBackgroundColor(SettingsStateStore.isEnabled(SettingsType.BACKGROUND_MODE), 0.3)}}
                value={SettingsStateStore.isFullMode() ? 'full' : 'compact'}
                exclusive
                size={"small"}
                orientation="vertical"
                aria-label="text alignment">
                <ToggleButton
                    onClick={() => SettingsStateStore.handleFullModeToggle(false)}
                    value="compact" aria-label="left aligned">
                    <Tooltip title={'Compact mode'}><ViewCompactIcon/></Tooltip>
                </ToggleButton>
                <ToggleButton
                    onClick={() => SettingsStateStore.handleFullModeToggle(true)}
                    value="full" aria-label="centered">
                    <Tooltip title={'Full mode'}><SubjectIcon/></Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}