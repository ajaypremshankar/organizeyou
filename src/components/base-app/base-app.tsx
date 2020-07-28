import React, {useState} from 'react';
import {CompletedTask, DeltaAppDataStore, Task, TaskListType} from "../../types/types";
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

    const updateBaseStateAndSaveAppState = (deltaState: DeltaAppDataStore) => {

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

    const handleTaskCompletion = (key: string, task: Task) => {
        updateBaseStateAndSaveAppState(
            {
                ..._addTaskToList(TaskListType.COMPLETED, {
                    ...task,
                    completedDate: new Date()
                }),
                ..._removeTaskFromList(key, task)
            }
        )
    }

    const handleTaskAddition = (key: string, task: Task) => {
        updateBaseStateAndSaveAppState(
            _addTaskToList(key, task)
        )
    }

    const handleTaskDeletion = (key: string, task: Task) => {
        updateBaseStateAndSaveAppState(
            _removeTaskFromList(key, task)
        )
    }

    const handleRestoreTask = (task: CompletedTask) => {

        let key = task.plannedOn
        const date: Date = parseFromDDMMyyyy(key)
        const today: Date = parseFromDDMMyyyy(getToday())

        if(today > date) {
            key = TaskListType.OVERDUE;
        }

        updateBaseStateAndSaveAppState(
            {
                ..._addTaskToList(key, task),
                ..._removeTaskFromList(TaskListType.COMPLETED, task)
            }
        )
    }

    const _addTaskToList = (key: string, task: Task | CompletedTask): DeltaAppDataStore => {
        let deltaState: DeltaAppDataStore = {}

        if (key === TaskListType.OVERDUE) {
            const overdueTasks: Task[] = [...baseState.overdueTasks || []].filter(t => t.id !== task.id)
            overdueTasks.push(task)

            deltaState = {
                ...deltaState,
                overdueTasks: overdueTasks,
            }
        } else if (key === TaskListType.COMPLETED) {
            const newCompletedTasks: CompletedTask[] = baseState.completedTasks ? [...baseState.completedTasks] : []
            newCompletedTasks.push(task as CompletedTask)

            deltaState = {
                ...deltaState,
                completedTasks: newCompletedTasks,
            }

        } else {
            const tasks = baseState.tasks;
            const dayList = [...baseState.tasks.get(key) || []];
            const filteredList = [...dayList.filter(t => t.id !== task.id)];
            filteredList.push(task)
            tasks.set(key, filteredList);

            deltaState = {
                ...deltaState,
                tasks: tasks
            }
        }

        return deltaState
    }

    const _removeTaskFromList = (key: string, task: Task | CompletedTask): DeltaAppDataStore => {

        console.log(key)

        let deltaState: DeltaAppDataStore = {}

        if (key === TaskListType.OVERDUE) {
            const overdueTasks = new Set<Task>(baseState.overdueTasks || [])
            overdueTasks.delete(task as Task)

            deltaState = {
                ...deltaState,
                overdueTasks: Array.from(overdueTasks),
            }

        } else if (key === TaskListType.COMPLETED) {

            const completedTasks = new Set<CompletedTask>(baseState.completedTasks || [])
            completedTasks.delete(task as CompletedTask)

            deltaState = {
                ...deltaState,
                completedTasks: Array.from(completedTasks),
            }
        } else {
            const allActiveTasks = new Map<string, Task[]>(baseState.tasks);
            const targetTaskList = new Set<Task>(allActiveTasks.get(key) || [])
            targetTaskList.delete(task)

            allActiveTasks.set(key, Array.from(targetTaskList))

            deltaState = {
                ...deltaState,
                tasks: allActiveTasks,
            }
        }

        return deltaState
    }

    return (
        <div className={classes.root}>
            <AddTaskContainer
                selectedDate={baseState.currentlySelectedDate}
                changeSelectedDate={updateCurrentlySelectedDate}
                addTask={handleTaskAddition}/>

            <TaskListsContainer
                selectedDate={baseState.currentlySelectedDate}
                tasks={baseState.tasks}
                overdueTasks={baseState.overdueTasks}
                completedTasks={baseState.completedTasks || []}
                update={handleTaskAddition}
                complete={handleTaskCompletion}
                delete={handleTaskDeletion}
                restore={handleRestoreTask}
            />
        </div>
    );
}
