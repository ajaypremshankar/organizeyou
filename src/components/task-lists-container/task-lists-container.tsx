import React from 'react';
import {CompletedTask, Task, TaskListType} from "../../types/types";
import {getListTitleFromKey} from "../../utils/date-utils";
import DayBasedTaskList from "./day-based-task-list";
import CompletedTaskList from "./completed-task-list";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import OverdueTaskList from "./overdue-task-list";

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
    overdueTasks?: Task[]
    update: (key: string, task: Task) => void
    complete: (key: string, task: Task) => void
    delete: (key: string, task: Task) => void
    restore: (task: CompletedTask) => void
}

const getOverdueList = (props: TaskListsContainerProps) => {

    if (!props.overdueTasks || props.overdueTasks.length === 0) return;

    return <OverdueTaskList title={TaskListType.OVERDUE} update={props.update} tasks={Array.from(props.overdueTasks || [])}
                            complete={props.complete} delete={props.delete}
                            expanded={true}/>
}

const getSelectedDateList = (props: TaskListsContainerProps) => {
    const key = props.selectedDate;
    const dateList = props.tasks.get(key) || []
    return <DayBasedTaskList title={getListTitleFromKey(key)} update={props.update} tasks={Array.from(dateList)}
                             complete={props.complete} delete={props.delete}
                             expanded={true}/>
}

const getCompletedList = (props: TaskListsContainerProps) => {
    const completedTaskList = props.completedTasks
    if (completedTaskList.length === 0) return;
    return <CompletedTaskList title={'Completed'} tasks={completedTaskList} restore={props.restore}/>
}

export default function TaskListsContainer(props: TaskListsContainerProps) {
    const classes = useStyles();
    return (
        <div className={classes.fullWidth}>
            {getOverdueList(props)}
            {getSelectedDateList(props)}
            {getCompletedList(props)}
        </div>
    )
}