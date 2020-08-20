import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { StateStore } from "../../../state-stores/state-store";
import OverdueTaskList from "../../task-lists-container/overdue-task-list";
import DayBasedTaskList from "../../task-lists-container/day-based-task-list";
import CompletedTaskList from "../../task-lists-container/completed-task-list";
import { SettingsStateStore } from "../../../state-stores/settings-state";
import { SettingsType } from "../../../types/types";

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

    const getOverdueList = () => {
        return StateStore.getOverdueTasks().isNotEmpty() ? <OverdueTaskList/> : null
    }

    const getSelectedDateList = () => {
        return <DayBasedTaskList expanded={true}/>
    }

    const getCompletedList = () => {
        return StateStore.getCompletedTasks().isNotEmpty() ? <CompletedTaskList/> : null
    }

    return (
        <div className={classes.fullWidth}>
            <div style={{
                textAlign: 'right',
                marginBottom: '5px',
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={SettingsStateStore.isShowAllTasks()}
                            onChange={SettingsStateStore.handleShowAllToggle}
                            name="checkedB"
                            color="primary"
                            edge={'start'}
                            size="small"
                        />
                    }
                    label="Show all tasks"
                />
            </div>
            {!SettingsStateStore.isShowAllTasks() && getOverdueList()}
            {getSelectedDateList()}
            { SettingsStateStore.isEnabled(SettingsType.SHOW_COMPLETED_TASKS) && props.showCompleted && getCompletedList()}
        </div>
    );
}
