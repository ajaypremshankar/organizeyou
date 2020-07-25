import React, {useState} from 'react';
import ListContainer from "../list-container/list-container";
import TopButtonGroup from "../top-button-group/top-button-group";
import AddNewTask from "../add-new-task/add-new-task";
import {Task} from "../../types/types";

interface BaseAppState {
    showAdd: boolean,
    currentlySelectedDate: string,
    tasks: Map<string, Task[]>
}

export default function BaseApp() {

    const initState: BaseAppState = {
        showAdd: false,
        currentlySelectedDate: '',
        tasks: new Map<string, Task[]>()
    }

    const [baseState, setBaseState] = useState(
        initState
    );

    const showAddNewTask = (day: string) => {

        setBaseState({
            ...baseState,
            currentlySelectedDate: day,
            showAdd: true,
        })
    }

    const addTask = (task: Task) => {
        const tasks = baseState.tasks;
        const dayList = baseState.tasks.get(baseState.currentlySelectedDate) || [];

        dayList.push(task)
        tasks.set(baseState.currentlySelectedDate, dayList);
        setBaseState({
            ...baseState,
            showAdd: false,
            tasks: tasks
        })

        console.log(baseState)
    }

    let lists: JSX.Element[] = []
    {
        baseState.tasks.forEach((v, k) => {
            lists.push(<ListContainer date={k} tasks={v}/>)
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
            {lists}
        </div>
    );
}
