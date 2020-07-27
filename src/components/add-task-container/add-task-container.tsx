import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import TopButtonGroup from "./top-button-group/top-button-group";
import AddNewTask from "./add-new-task/add-new-task";
import {Task} from "../../types/types";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            margin: 'auto',
            align: 'center',
            maxWidth: 600,
            '& > *': {
                margin: theme.spacing(1),
            },
        }
    }),
);

interface AddTaskContainerProps {
    selectedDate: string,
    changeSelectedDate: (date: string) => void,
    addTask: (task: Task) => void,
}

export default function AddTaskContainer(props: AddTaskContainerProps) {
    const classes = useStyles()

    const [addTaskState, setAddTaskState] = useState(
        {
            date: props.selectedDate,
        }
    )

    const handleDateChange = (date: string) => {
        setAddTaskState(
            {
                ...addTaskState,
                date: date,
            })
        props.changeSelectedDate(date)
    }

    const handleAddTask = (value: string) => {
        props.addTask({
            id: new Date().getMilliseconds(),
            plannedOn: addTaskState.date,
            value: value
        })
    }

return (
    <Fade in={true}>
        <Grid className={classes.container} container justify="space-around">
            <TopButtonGroup
                selectedDate={addTaskState.date}
                chooseDate={handleDateChange}/>
            <AddNewTask
                date={addTaskState.date}
                addTask={handleAddTask}/>
        </Grid>
    </Fade>
);
}
