import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DaySelectButtonGroup from "./day-select-button-group";
import AddNewTask from "./add-new-task";
import Grid from "@material-ui/core/Grid";
import { getCurrentMillis } from "../../../utils/date-utils";
import { AppStateService } from "../../../state-stores/tasks/app-state-service";
import { TagUtils } from "../../../utils/tag-utils";

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
                margin: theme.spacing(2),
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

    const handleDateChange = (date: number) => {
        setAddTaskState(date)
        AppStateService.updateCurrentlySelectedDate(date)
    }

    const handleAddTask = (value: string) => {
        const now = getCurrentMillis()
        const tags = TagUtils.getTags(value)
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
    }

    return (
        <Grid className={classes.container} container justify="space-around">
            { props.showDaySelect && <DaySelectButtonGroup
                date={addTaskState}
                chooseDate={handleDateChange}/> }
            <AddNewTask
                date={addTaskState}
                addTask={handleAddTask}/>
        </Grid>
    );
}
