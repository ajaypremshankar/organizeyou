import React, {useState} from 'react';
import DayBasedTaskList from "../task-lists-container/day-based-task-list";
import TopButtonGroup from "../top-button-group/top-button-group";
import AddNewTask from "../add-new-task/add-new-task";
import {RootDataStore, Task} from "../../types/types";
import TaskListsContainer from "../task-lists-container/task-lists-container";


export default function BaseApp() {

    const initState: RootDataStore = {
        showAdd: false,
        currentlySelectedDate: '',
        tasks: new Map<string, Set<Task>>()
    }

    const [baseState, setBaseState] = useState(
        initState
    );

    const markTaskComplete = (task: Task) => {
        const allActiveTasks = new Map<string, Set<Task>>(baseState.tasks);
        const targetTaskList = new Set<Task>(allActiveTasks.get(task.plannedDate) || new Set<Task>())

        targetTaskList.delete(task)
        allActiveTasks.set(task.plannedDate, targetTaskList)

        const completedTasks = baseState.archivedTasks ? [...baseState.archivedTasks] : []
        completedTasks.push({
            ...task,
            completedDate: new Date()
        })

        setBaseState({
            ...baseState,
            tasks: allActiveTasks,
            archivedTasks: completedTasks
        })
    }

    const showAddNewTask = (day: string) => {

        setBaseState({
            ...baseState,
            currentlySelectedDate: day,
            showAdd: true,
        })
    }

    const addTask = (task: Task) => {
        const tasks = baseState.tasks;
        const dayList = baseState.tasks.get(baseState.currentlySelectedDate) || new Set<Task>();

        dayList.add(task)
        tasks.set(baseState.currentlySelectedDate, dayList);
        setBaseState({
            ...baseState,
            showAdd: false,
            tasks: tasks
        })

        console.log(baseState)
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
                archivedTasks={baseState.archivedTasks || []}
                complete={markTaskComplete}/>
        </div>
    );
}
