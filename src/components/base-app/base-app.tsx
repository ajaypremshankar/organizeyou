import React, {useState} from 'react';
import {CompletedTask, Task} from "../../types/types";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AddTaskContainer from "../add-task-container/add-task-container";
import {loadAppState, updateAppState} from "../../utils/app-state-utils";
import OverdueTaskList from "../task-lists-container/overdue-task-list";
import DayBasedTaskList from "../task-lists-container/day-based-task-list";
import CompletedTaskList from "../task-lists-container/completed-task-list";
import {BaseTasksState} from "../../types/base-tasks-state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: 'auto',
            maxWidth: 600,
            alignItems: 'center',
            '& > *': {
                margin: theme.spacing(4),
            },
        },
        fullWidth: {
            width: '100%'
        }
    }),
);

export default function BaseApp() {
    const classes = useStyles();

    const [baseState, setBaseState] = useState(
        loadAppState()
    );

    const updateBaseState = (newState: BaseTasksState) => {
        updateAppState(newState)
        setBaseState(newState)
    }

    const updateCurrentlySelectedDate = (date: number) => {
        updateBaseState(new BaseTasksState(date, baseState.tasks))
    }

    const handleTaskCompletion = (key: number, task: Task) => {
        updateBaseState(baseState.completeTask(task))
    }

    const handleTaskAddition = (key: number, task: Task) => {
        updateBaseState(baseState.addTask(key, task))
    }

    const handleTaskDeletion = (key: number, task: Task) => {
        updateBaseState(baseState.removeTask(key, task))
    }

    const handleUndoComplete = (task: CompletedTask) => {
        updateBaseState(baseState.undoCompleteTask(task))
    }

    const getOverdueList = () => {

        return baseState.getOverdueTasks().isNotEmpty() ?
            <OverdueTaskList
                content={baseState.getOverdueTasks()}
                update={handleTaskAddition}
                complete={handleTaskCompletion} delete={handleTaskDeletion}/>
            : null
    }

    const getSelectedDateList = () => {
        const dateList = baseState.getSelectedDateTasks()

        return dateList.isNotEmpty() ?
            <DayBasedTaskList content={dateList}
                              update={handleTaskAddition}
                              complete={handleTaskCompletion}
                              delete={handleTaskDeletion}
                              expanded={true}/>
            : null
    }

    const getCompletedList = () => {
        return baseState.getCompletedTasks().isNotEmpty() ?
            <CompletedTaskList
                content={baseState.getCompletedTasks()}
                undoComplete={handleUndoComplete}/>
            : null
    }

    return (
        <div className={classes.root}>
            <AddTaskContainer
                keyTitle={baseState.getKeyTitle()}
                changeSelectedDate={updateCurrentlySelectedDate}
                addTask={handleTaskAddition}/>

            <div className={classes.fullWidth}>
                {getOverdueList()}
                {getSelectedDateList()}
                {getCompletedList()}
            </div>
        </div>
    )
}

