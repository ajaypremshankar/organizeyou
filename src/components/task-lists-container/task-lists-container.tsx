import React from 'react';
import {CompletedTask, Task} from "../../types/types";
import {getDisplayableDateFromDDMMYYYY, getToday, getTomorrow} from "../../utils/date-utils";
import DayBasedTaskList from "./day-based-task-list";
import CompletedTaskList from "./completed-task-list";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: '100%'
        }
    }),
);


interface TaskListsContainerProps {
    selectedDate: string,
    tasks: Map<string, Task[]>,
    completedTasks: CompletedTask[],
    update: (task: Task) => void
    complete: (task: Task) => void
}

const getTodayList = (props: TaskListsContainerProps) => {
    const key = getToday();
    const todays = props.tasks.get(key) || []
    if (todays.length === 0) return;
    return <DayBasedTaskList title={'Today'} update={props.update} tasks={Array.from(todays)} complete={props.complete}
                             expanded={true}/>
}

const getTomorrowList = (props: TaskListsContainerProps) => {
    const key = getTomorrow();
    const tomm = props.tasks.get(key) || []

    if (tomm.length === 0) return;
    return <DayBasedTaskList title={'Tomorrow'} update={props.update} tasks={Array.from(tomm)} complete={props.complete}
                             expanded={false}/>
}

const getSelectedDateList = (props: TaskListsContainerProps) => {
    const key = props.selectedDate;
    const dateList = props.tasks.get(key) || []
    return <DayBasedTaskList title={getDisplayableDateFromDDMMYYYY(key)} update={props.update} tasks={Array.from(dateList)} complete={props.complete}
                             expanded={true}/>
}

const getRestList = (props: TaskListsContainerProps) => {

    const copiedTasks = new Map<string, Task[]>(props.tasks)
    copiedTasks.delete(getToday())
    copiedTasks.delete(getTomorrow())
    const restList: Task[] = []

    copiedTasks.forEach((value, key) => {
        restList.push(...Array.from(value))
    })

    if (restList.length === 0) return;
    return <DayBasedTaskList title={'Later'} update={props.update} tasks={restList} complete={props.complete}
                             expanded={false}/>
}

const getCompletedList = (props: TaskListsContainerProps) => {
    const completedTaskList = props.completedTasks
    if (completedTaskList.length === 0) return;
    return <CompletedTaskList title={'Completed'} tasks={completedTaskList}/>
}

export default function TaskListsContainer(props: TaskListsContainerProps) {
    const classes = useStyles();
    return (
        <div className={classes.fullWidth}>
            {getSelectedDateList(props)}
            {getCompletedList(props)}
        </div>
    )
}