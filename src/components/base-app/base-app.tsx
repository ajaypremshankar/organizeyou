import React, {useState} from 'react';
import {CompletedTask, DayType, RootDataStore, Task} from "../../types/types";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TaskListsContainer from "../task-lists-container/task-lists-container";
import AddTaskContainer from "../add-task-container/add-task-container";
import {initOrRefreshAppStateData, serializeAppState} from "../../utils/app-state-utils";
import {getToday, parseFromDDMMyyyy} from "../../utils/date-utils";

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
        initOrRefreshAppStateData()
    );

    const updateBaseStateAndSaveAppState = (deltaState: RootDataStore) => {
        setBaseState({
            ...baseState,
            ...deltaState
        })

        serializeAppState(deltaState)
    }

    const updateCurrentlySelectedDate = (date: string) => {
        updateBaseStateAndSaveAppState({
            ...baseState,
            currentlySelectedDate: date
        })
    }

    const markTaskComplete = (task: Task) => {
        console.log(task)
        const allActiveTasks = new Map<string, Task[]>(baseState.tasks);

        const newOverdueTasks: Task[] = []

        if (allActiveTasks.get(task.plannedOn)) {
            const targetTaskList = new Set<Task>(allActiveTasks.get(task.plannedOn) || baseState.overdueTasks || [])
            targetTaskList.delete(task)
            allActiveTasks.set(task.plannedOn, Array.from(targetTaskList))
        } else {
            const targetTaskList = new Set<Task>(baseState.overdueTasks || [])
            targetTaskList.delete(task)
            newOverdueTasks.push(...Array.from(targetTaskList))
        }
        const completedTasks = baseState.completedTasks ? [...baseState.completedTasks] : []
        completedTasks.push({
            ...task,
            completedDate: new Date()
        })

        updateBaseStateAndSaveAppState({
            ...baseState,
            tasks: allActiveTasks,
            completedTasks: completedTasks,
            overdueTasks: newOverdueTasks
        })
    }

    const addTask = (task: Task) => {
        const today: Date = parseFromDDMMyyyy(getToday())

        if (today > parseFromDDMMyyyy(task.plannedOn)) {
            const overdueTasks = [...baseState.overdueTasks || []].filter(t => t.id !== task.id)
            overdueTasks.push(task)

            console.log(overdueTasks)
            updateBaseStateAndSaveAppState({
                ...baseState,
                overdueTasks: overdueTasks,
            })
        } else {

            const tasks = baseState.tasks;
            const dayList = [...baseState.tasks.get(task.plannedOn) || []];
            const filteredList = [...dayList.filter(t => t.id !== task.id)];
            filteredList.push(task)
            tasks.set(task.plannedOn, filteredList);

            updateBaseStateAndSaveAppState({
                ...baseState,
                tasks: tasks
            })
        }
    }

    const restoreTask = (task: CompletedTask) => {
        const newCompletedTaskList = new Set<CompletedTask>(baseState.completedTasks || [])
        newCompletedTaskList.delete(task)

        const today: Date = parseFromDDMMyyyy(getToday())

        if (today > parseFromDDMMyyyy(task.plannedOn)) {
            const overdueTasks = [...baseState.overdueTasks || []]
            overdueTasks.push(task)

            updateBaseStateAndSaveAppState({
                ...baseState,
                overdueTasks: overdueTasks,
                completedTasks: Array.from(newCompletedTaskList)
            })

        } else {

            const allActiveTasks = new Map<string, Task[]>(baseState.tasks);
            const targetTaskList = [...allActiveTasks.get(task.plannedOn) || []]
            targetTaskList.push({
                id: task.id,
                plannedOn: task.plannedOn,
                value: task.value
            })

            allActiveTasks.set(task.plannedOn, targetTaskList)

            updateBaseStateAndSaveAppState({
                ...baseState,
                tasks: allActiveTasks,
                completedTasks: Array.from(newCompletedTaskList)
            })
        }

    }

    const deleteTask = (key: string, task: Task) => {

        console.log(key)
        console.log(task)

        if(key === DayType.OVERDUE) {
            const overdueTasks = new Set<Task>(baseState.overdueTasks || [])
            overdueTasks.delete(task)

            updateBaseStateAndSaveAppState({
                ...baseState,
                overdueTasks: Array.from(overdueTasks),
            })
        } else {
            const allActiveTasks = new Map<string, Task[]>(baseState.tasks);
            const targetTaskList = new Set<Task>(allActiveTasks.get(task.plannedOn) || [])
            targetTaskList.delete(task)

            allActiveTasks.set(task.plannedOn, Array.from(targetTaskList))

            updateBaseStateAndSaveAppState({
                ...baseState,
                tasks: allActiveTasks,
            })
        }
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
                overdueTasks={baseState.overdueTasks}
                update={addTask}
                completedTasks={baseState.completedTasks || []}
                complete={markTaskComplete}
                delete={deleteTask}
                restore={restoreTask}
            />
        </div>
    );
}
