import React from 'react';
import {CompletedTask, Task} from "../../types/types";
import {getToday, getTomorrow} from "../../utils/date-utils";
import DayBasedTaskList from "./day-based-task-list";
import CompletedTaskList from "./completed-task-list";


interface TaskListsContainerProps {
    tasks: Map<string, Task[]>,
    archivedTasks: CompletedTask[],
    complete: (task: Task) => void
}

const getTodayList = (props: TaskListsContainerProps) => {
    const key = getToday();
    const todays = props.tasks.get(key) || []
    if(todays.length === 0) return;
    return <DayBasedTaskList title={'Today'} tasks={Array.from(todays)} complete={props.complete} />

}

const getTomorrowList = (props: TaskListsContainerProps) => {
    const key = getTomorrow();
    const tomm = props.tasks.get(key) || []

    if(tomm.length === 0) return;
    return <DayBasedTaskList title={'Tomorrow'} tasks={Array.from(tomm)} complete={props.complete} />
}

const getRestList = (props: TaskListsContainerProps) => {

    const copiedTasks = new Map<string, Task[]>(props.tasks)
    copiedTasks.delete(getToday())
    copiedTasks.delete(getTomorrow())
    const restList: Task[] = []

    copiedTasks.forEach((value, key) => {
        restList.push(...Array.from(value))
    })

    if(restList.length === 0) return;
    return <DayBasedTaskList title={'Later'} tasks={restList} complete={props.complete} />
}

const getCompletedList = (props: TaskListsContainerProps) => {
    const completedTaskList = props.archivedTasks
    if(completedTaskList.length === 0) return;
    return <CompletedTaskList title={'Completed'} tasks={completedTaskList} />
}

export default function TaskListsContainer(props: TaskListsContainerProps) {
    return (
        <div>
            {getTodayList(props)}
            {getTomorrowList(props)}
            {getRestList(props)}
            {getCompletedList(props)}
        </div>
    )
}