import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { Task } from "../../types/types";
import TaskItem from "../task-item/task-item";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DoneAllIcon from '@material-ui/icons/DoneAll';
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
        },
        itemText: {
            fontWeight: 'bold',
            fontSize: '16px',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
        }
    }),
);

interface DateTasks {
    content: DisplayableTaskList
    move: (from: number, to: number, task: Task) => void
    update: (key: number, task: Task) => void
    complete: (key: number, task: Task) => void
    expanded?: boolean
    delete: (key: number, task: Task) => void
    showAll: boolean
}


export default function DayBasedTaskList(props: DateTasks) {

    const classes = useStyles();

    const getTasks = () => {

        if (props.content.isEmpty()) {
            return Array.of(<ListItem
                key={'no-items-in-list'}
                role={undefined} dense>
                <ListItemIcon>
                    <DoneAllIcon/>
                </ListItemIcon>
                <ListItemText
                    className={classes.itemText}
                    id={'no-item'}
                    primary={`Nothing awaits you here (✿´‿\`)`}
                />
            </ListItem>)
        }

        return (props.content.tasks as Task[]).map((value, index) => {
            const labelId = `checkbox-list-label-${value.id}`;
            return (
                <TaskItem
                    move={props.move}
                    showPlannedOn={props.showAll}
                    update={props.update}
                    key={labelId} task={value}
                    complete={props.complete} delete={props.delete}/>
            );
        })
    }

    return (
        <div>
            <AppAccordion
                id={`${props.content.title}-task`}
                initialExpanded={true}
                summary={
                    <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                        {props.content.title.toUpperCase()}
                    </Typography>}
                details={
                    <List className={classes.list}>
                        {getTasks()}
                    </List>
                }/>
        </div>
    );
}
