import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { Task } from "../../types/types";
import TaskItem from "../task-item/task-item";
import AppAccordion from "../common/app-accordian";
import { AppStateService } from "../../state-stores/tasks/app-state-service";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: '100%',
            margin: 'auto',
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            textAlign: 'left',
            fontSize: theme.typography.pxToRem(15),
            width: '100%',
            margin: 'auto',
            flexShrink: 0,
            fontWeight: 'bold',
            color: 'orange'
        },
    }),
);

interface OverdueTaskListProps {
}


export default function OverdueTaskList(props: OverdueTaskListProps) {

    const classes = useStyles();
    const overdueTaskList = AppStateService.getOverdueTasks()

    if (overdueTaskList.isEmpty()) {
        return null
    }

    const getTasks = (tasks: Task[]) => {
        return tasks.map((value, index) => {
            const labelId = `checkbox-list-label-${value.id}`;
            return (
                <TaskItem
                    showPlannedOn={true}
                    key={labelId} task={value}
                />
            );
        })
    }

    function getSummary() {
        return <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
            {overdueTaskList.title.toUpperCase()}
        </Typography>;
    }

    return (
        <AppAccordion
            id={'overdue-task'}
            initialExpanded={true}
            summary={getSummary()}
            details={
                <List className={classes.list}>
                    {getTasks(overdueTaskList.tasks)}
                </List>}
        />
    );
}
