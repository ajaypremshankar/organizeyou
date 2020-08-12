import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { Task } from "../../types/types";
import TaskItem from "../task-item/task-item";
import { DisplayableTaskList } from "../../types/displayable-task-list";
import AppAccordion from "../common/app-accordian";

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
    content: DisplayableTaskList
    move: (from: number, to: number, task: Task) => void
    update: (key: number, task: Task) => void
    complete: (key: number, task: Task) => void
    delete: (key: number, task: Task) => void
}


export default function OverdueTaskList(props: DateTasks) {

    const classes = useStyles();

    const getTasks = (tasks: Task[]) => {
        return tasks.map((value, index) => {
            const labelId = `checkbox-list-label-${value.id}`;
            return (
                <TaskItem
                    move={props.move}
                    showPlannedOn={true}
                    update={props.update} key={labelId} task={value}
                    complete={props.complete} delete={props.delete}/>
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
                        {props.content.title.toUpperCase()}
                    </Typography>
                }
                details={
                    <List className={classes.list}>
                        {getTasks(props.content.tasks)}
                    </List>}/>
        </div>
    );
}
