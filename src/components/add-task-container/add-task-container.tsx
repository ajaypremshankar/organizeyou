import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TopButtonGroup from "./top-button-group/top-button-group";
import AddNewTask from "./add-new-task/add-new-task";
import {Task} from "../../types/types";
import Grid from "@material-ui/core/Grid";
import {KeyTitlePair} from "../../types/key-title-pair";

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
    keyTitle: KeyTitlePair,
    changeSelectedDate: (date: number) => void,
    addTask: (key: number, task: Task) => void,
}

export default function AddTaskContainer(props: AddTaskContainerProps) {
    const classes = useStyles()

    const [addTaskState, setAddTaskState] = useState(props.keyTitle)

    const handleDateChange = (date: number) => {
        setAddTaskState(new KeyTitlePair(date))
        props.changeSelectedDate(date)
    }

    const handleAddTask = (value: string) => {
        props.addTask(
            addTaskState.key,
            {
                id: new Date().getTime(),
                plannedOn: addTaskState.key,
                value: value
            })
    }

    return (
        <Grid className={classes.container} container justify="space-around">
            <TopButtonGroup
                keyTitle={addTaskState}
                chooseDate={handleDateChange}/>
            <AddNewTask
                keyTitle={addTaskState}
                addTask={handleAddTask}/>
        </Grid>
    );
}