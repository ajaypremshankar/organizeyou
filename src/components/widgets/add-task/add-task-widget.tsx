import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DaySelectButtonGroup from "./day-select-button-group";
import AddNewTask from "./add-new-task";
import Grid from "@material-ui/core/Grid";
import { getCurrentMillis } from "../../../utils/date-utils";
import { AppStateService } from "../../../state-stores/tasks/app-state-service";
import { HashTagUtils } from "../../../state-stores/hash-tags/hash-tag-utils";
import { TASK_FREQUENCY_TYPE } from "../../../types/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            margin: 'auto',
            width: '100%',
            align: 'center',
            '& > *': {
                margin: theme.spacing(1),
            },
        }
    }),
);

interface AddTaskWidgetProps {
    showDaySelect: boolean
}

export default function AddTaskWidget(props: AddTaskWidgetProps) {
    const classes = useStyles()

    const [addTaskState, setAddTaskState] = useState(AppStateService.getSelectedDate())

    const [taskFrequency, setTaskFrequency] = useState(TASK_FREQUENCY_TYPE.YEARLY)

    const handleDateChange = (date: number) => {
        setAddTaskState(date)
        AppStateService.updateCurrentlySelectedDate(date)
    }

    const handleAddTask = (value: string) => {
        const now = getCurrentMillis()
        const tags = HashTagUtils.parseHashTags(value)
        AppStateService.handleTaskAdditionOrUpdation(
            null,
            {
                id: now,
                plannedOn: addTaskState,
                value: value,
                createdOn: now,
                updatedOn: now,
                tags: tags
            })

        AppStateService.clearCurrentlySelectedList()
    }

    return (
        <Grid className={classes.container} container justify="space-around">
            { props.showDaySelect && <DaySelectButtonGroup
                date={addTaskState}
                chooseDate={handleDateChange}/> }
            <AddNewTask
                date={addTaskState}
                addTask={handleAddTask}
                taskFrequency={taskFrequency}
                changeTaskFrequency={setTaskFrequency}
            />
        </Grid>
    );
}
