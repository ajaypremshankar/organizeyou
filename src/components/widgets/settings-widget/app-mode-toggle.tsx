import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import SubjectIcon from '@material-ui/icons/Subject';
import Tooltip from "@material-ui/core/Tooltip";
import { SettingsStateStore } from "../../../state-stores/settings-state";
import { SettingsType } from "../../../types/types";

export default function AppMode() {

    return (
        <div>
            <ToggleButtonGroup
                style={{background: !SettingsStateStore.isEnabled(SettingsType.BACKGROUND_MODE) ? `rgba(0, 0, 0, 0)` : `rgba(0, 0, 0, 0.3)`}}
                value={SettingsStateStore.isFullMode() ? 'full' : 'compact'}
                exclusive
                size={"small"}
                orientation="vertical"
                onChange={SettingsStateStore.handleFullModeToggle}
                aria-label="text alignment">
                <ToggleButton
                    disabled={!SettingsStateStore.isEnabled(SettingsType.FULL_MODE)}
                    value="compact" aria-label="left aligned">
                    <Tooltip title={'Compact mode'}><ViewCompactIcon/></Tooltip>
                </ToggleButton>
                <ToggleButton
                    disabled={SettingsStateStore.isEnabled(SettingsType.FULL_MODE)}
                    value="full" aria-label="centered">
                    <Tooltip title={'Full mode'}><SubjectIcon/></Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
