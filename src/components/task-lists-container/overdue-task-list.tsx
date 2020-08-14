import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { Task } from "../../types/types";
import TaskItem from "../task-item/task-item";
import AppAccordion from "../common/app-accordian";
import { StateStore } from "../../types/state-store";

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

interface DateTasks {
}


export default function OverdueTaskList(props: DateTasks) {

    const classes = useStyles();

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

    return (
        //This div saves overdue world from shaking. Don't ask me how!
        <div>
            <AppAccordion
                id={'overdue-task'}
                initialExpanded={true}
                summary={
                    <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                        {StateStore.getOverdueTasks().title.toUpperCase()}
                    </Typography>
                }
                details={
                    <List className={classes.list}>
                        {getTasks(StateStore.getOverdueTasks().tasks)}
                    </List>}/>
        </div>
    );
}
