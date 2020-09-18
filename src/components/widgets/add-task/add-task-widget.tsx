import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DaySelectButtonGroup from "./day-select-button-group";
import AddNewTask from "./add-new-task";
import Grid from "@material-ui/core/Grid";
import { getTodayKey } from "../../../utils/date-utils";
import { AppStateService } from "../../../state-stores/tasks/app-state-service";
import { TASK_FREQUENCY_TYPE } from "../../../types/types";
import { AppStateFacade } from "../../../state-stores/app-state-facade";

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

export interface DateAndFrequency {
    date: number,
    frequency: TASK_FREQUENCY_TYPE
}

interface AddTaskWidgetProps {
    showDaySelect: boolean
}

export default function AddTaskWidget(props: AddTaskWidgetProps) {
    const classes = useStyles()

    const [dateAndFrequencyState, setDateAndFrequencyState] = useState({
        date: getTodayKey(),
        frequency: TASK_FREQUENCY_TYPE.NO_REPEAT
    })

    const handleFrequencySelect = (selected: TASK_FREQUENCY_TYPE) => {
        setDateAndFrequencyState({
            ...dateAndFrequencyState,
            frequency: selected
        })
    }

    const handleDateAndFrequencySelect = (dateAndFrequency: DateAndFrequency) => {
        setDateAndFrequencyState(dateAndFrequency)
        AppStateService.updateCurrentlySelectedDate(dateAndFrequency.date)
    }

    const handleAddTask = (value: string) => {
        AppStateFacade.addTask(dateAndFrequencyState.frequency, dateAndFrequencyState.date, value)
        AppStateService.clearCurrentlySelectedList()
    }

    return (
        <Grid className={classes.container} container justify="space-around">
            {props.showDaySelect && <DaySelectButtonGroup
                dateAndFrequency={dateAndFrequencyState}
                onSelect={handleDateAndFrequencySelect}/>}
            <AddNewTask
                date={dateAndFrequencyState.date}
                addTask={handleAddTask}
                taskFrequency={dateAndFrequencyState.frequency}
                changeTaskFrequency={handleFrequencySelect}
            />
        </Grid>
    );
}
