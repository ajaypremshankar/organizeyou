import React, {useState} from 'react';
import TopButtonGroup from "../top-button-group/top-button-group";
import AddNewTask from "../add-new-task/add-new-task";
import {Task} from "../../types/types";
import TaskListsContainer from "../task-lists-container/task-lists-container";
import {loadAppState, updateAppState} from "../../utils/local-storage";


export default function BaseApp() {

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

    const showAddNewTask = (day: string) => {

        updateBaseState({
            ...baseState,
            currentlySelectedDate: day,
            showAdd: true,
        })
    }

    const addTask = (task: Task) => {
        console.log(task)
        const tasks = baseState.tasks;
        // TODO Task update is not reflecting on the UI.
        const dayList = [...baseState.tasks.get(task.plannedOn) || []];
        const filteredList = [...dayList.filter( t => t.id !== task.id)];

        filteredList.push(task)

        tasks.set(task.plannedOn, filteredList);

        updateBaseState({
            ...baseState,
            showAdd: false,
            tasks: tasks
        })
    }

    return (
        <div>
            {!baseState.showAdd &&
            <TopButtonGroup showAddTask={showAddNewTask}></TopButtonGroup>
            }

            {baseState.showAdd &&
            <AddNewTask
                date={baseState.currentlySelectedDate}
                showAdd={baseState.showAdd}
                addTask={addTask}/>
            }

            <TaskListsContainer
                tasks={baseState.tasks}
                update={addTask}
                archivedTasks={baseState.archivedTasks || []}
                complete={markTaskComplete}/>
        </div>
    );
}
