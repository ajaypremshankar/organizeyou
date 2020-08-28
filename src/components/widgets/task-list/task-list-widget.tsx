import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import OverdueTaskList from "../../task-lists-container/overdue-task-list";
import DayBasedTaskList from "../../task-lists-container/day-based-task-list";
import CompletedTaskList from "../../task-lists-container/completed-task-list";
import { SettingsStateService, SettingsType } from "../../../state-stores/settings/settings-state";
import HashTagsWidget from "../hash-tags/hash-tags-widget";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: '100%',
            margin: 'auto',
        },
        fullWidth: {
            width: '100%',
        }
    }),
);

interface TaskListWidgetProps {
    showCompleted?: boolean
}

export default function TaskListWidget(props: TaskListWidgetProps) {

    const classes = useStyles();

    const getSelectedDateList = () => {
        return <DayBasedTaskList expanded={true}/>
    }

    return (
        <div className={classes.fullWidth}>
            <div style={{
                textAlign: 'right',
                marginBottom: '20px',
            }}>
                {!SettingsStateService.isShowAllTasks() && <HashTagsWidget/>}
                <FormControlLabel
                    control={
                        <Switch
                            checked={SettingsStateService.isShowAllTasks()}
                            onChange={SettingsStateService.handleShowAllToggle}
                            name="checkedB"
                            color="primary"
                            edge={'start'}
                            size="small"
                        />
                    }
                    label="Show all tasks"
                />
            </div>
            {!SettingsStateService.isShowAllTasks() && !SettingsStateService.isHashTagListVisible() && <OverdueTaskList/> }
            {getSelectedDateList()}
            {SettingsStateService.isEnabled(SettingsType.SHOW_COMPLETED_TASKS) && props.showCompleted && <CompletedTaskList/>}
        </div>
    );
}
