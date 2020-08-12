import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewCompactIcon from '@material-ui/icons/ViewCompact';
import SubjectIcon from '@material-ui/icons/Subject';
import Tooltip from "@material-ui/core/Tooltip";
import { StateStore } from "../../../types/state-store";

export default function AppMode() {

    return (
        <ToggleButtonGroup
            value={StateStore.getState().fullMode ? 'full' : 'compact'}
            exclusive
            size={"small"}
            orientation="vertical"
            onChange={StateStore.handleFullModeToggle}
            aria-label="text alignment">
            <ToggleButton value="compact" aria-label="left aligned">
                <Tooltip title={'Compact mode'}><ViewCompactIcon /></Tooltip>
            </ToggleButton>
            <ToggleButton value="full" aria-label="centered">
                <Tooltip title={'Full mode'}><SubjectIcon /></Tooltip>
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
