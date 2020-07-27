import React, {useState} from 'react';
import {Task} from "../../types/types";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TaskListsContainer from "../task-lists-container/task-lists-container";
import {loadAppState, updateAppState} from "../../utils/local-storage";
import AddTaskContainer from "../add-task-container/add-task-container";


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
    }),
);

export default function BaseApp() {
    const classes = useStyles();

    const [baseState, setBaseState] = useState(
        loadAppState()
    );

    const updateBaseState = (deltaState: any) => {
        setBaseState({
            ...baseState,
            ...deltaState
        })
        updateAppState(deltaState)
    }

    const updateCurrentlySelectedDate = (date: string) => {
        updateBaseState({
            ...baseState,
            currentlySelectedDate: date
        })
    }

    const markTaskComplete = (task: Task) => {
        const allActiveTasks = new Map<string, Task[]>(baseState.tasks);
        const targetTaskList = new Set<Task>(allActiveTasks.get(task.plannedOn) || [])
        targetTaskList.delete(task)
        allActiveTasks.set(task.plannedOn, Array.from(targetTaskList))

        const completedTasks = baseState.archivedTasks ? [...baseState.archivedTasks] : []
        completedTasks.push({
            ...task,
            completedDate: new Date()
        })

        updateBaseState({
            tasks: allActiveTasks,
            archivedTasks: completedTasks
        })
    }

    const addTask = (task: Task) => {
        const tasks = baseState.tasks;
        // TODO Task update is not reflecting on the UI.

        const dayList = [...baseState.tasks.get(task.plannedOn) || []];
        const filteredList = [...dayList.filter( t => t.id !== task.id)];

        filteredList.push(task)

        tasks.set(task.plannedOn, filteredList);

        updateBaseState({
            ...baseState,
            tasks: tasks
        })
    }

    return (
        <div className={classes.root}>
            <AddTaskContainer
                selectedDate={baseState.currentlySelectedDate}
                changeSelectedDate={updateCurrentlySelectedDate}
                addTask={addTask}/>

            <TaskListsContainer
                selectedDate={baseState.currentlySelectedDate}
                tasks={baseState.tasks}
                update={addTask}
                completedTasks={baseState.archivedTasks || []}
                complete={markTaskComplete}/>
        </div>
    );
}
