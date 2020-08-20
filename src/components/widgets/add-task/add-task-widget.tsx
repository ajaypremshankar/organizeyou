import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DaySelectButtonGroup from "./day-select-button-group";
import AddNewTask from "./add-new-task";
import Grid from "@material-ui/core/Grid";
import { KeyTitlePair } from "../../../types/key-title-pair";
import { getCurrentMillis } from "../../../utils/date-utils";
import { StateStore } from "../../../state-stores/tasks/state-store";

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

    const [addTaskState, setAddTaskState] = useState(StateStore.getKeyTitle())

    const handleDateChange = (date: number) => {
        setAddTaskState(new KeyTitlePair(date))
        StateStore.updateCurrentlySelectedDate(date)
    }

    const handleAddTask = (value: string) => {
        const now = getCurrentMillis()
        StateStore.handleTaskAdditionOrUpdation(
            addTaskState.key,
            {
                id: now,
                plannedOn: addTaskState.key,
                value: value,
                createdOn: now,
                updatedOn: now
            })
    }

    return (
        <Grid className={classes.container} container justify="space-around">
            { props.showDaySelect && <DaySelectButtonGroup
                keyTitle={addTaskState}
                chooseDate={handleDateChange}/> }
            <AddNewTask
                keyTitle={addTaskState}
                addTask={handleAddTask}/>
        </Grid>
    );
}
