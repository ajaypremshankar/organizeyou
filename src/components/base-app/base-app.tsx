import React, {useState} from 'react';
import {CompletedTask, Task} from "../../types/types";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AddTaskContainer from "../add-task-container/add-task-container";
import {loadAppState, updateAppState} from "../../utils/app-state-utils";
import OverdueTaskList from "../task-lists-container/overdue-task-list";
import DayBasedTaskList from "../task-lists-container/day-based-task-list";
import CompletedTaskList from "../task-lists-container/completed-task-list";
import {BaseTasksState} from "../../types/base-tasks-state";
import Clock from '../clock/clock';


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
        const overdueTaskList = baseState.getOverdueTasks()
        return overdueTaskList.isNotEmpty() ?
            <OverdueTaskList
                content={overdueTaskList}
                update={handleTaskAddition}
                complete={handleTaskCompletion} delete={handleTaskDeletion}/>
            : null
    }

    const getSelectedDateList = () => {

        return <DayBasedTaskList content={baseState.getSelectedDateTasks()}
                              update={handleTaskAddition}
                              complete={handleTaskCompletion}
                              delete={handleTaskDeletion}
                              expanded={true}/>
    }

    const getCompletedList = () => {
        const completedTaskList = baseState.getCompletedTasks()
        return completedTaskList.isNotEmpty() ?
            <CompletedTaskList
                content={completedTaskList}
                undoComplete={handleUndoComplete}/>
            : null
    }

    return (
        <div className={classes.root}>
            <Clock></Clock>
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

