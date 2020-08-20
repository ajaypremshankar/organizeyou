import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { Task } from "../../types/types";
import TaskItem from "../task-item/task-item";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import AppAccordion from "../common/app-accordian";
import { StateStore } from "../../state-stores/tasks/state-store";
import { SettingsStateStore } from "../../state-stores/settings/settings-state";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: '100%',
            margin: 'auto',
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

interface DayBasedTaskListProps {
    expanded?: boolean
}


export default function DayBasedTaskList(props: DayBasedTaskListProps) {

    const classes = useStyles();
    const  targetTaskList = StateStore.getTargetTasks()

    const getTasks = () => {

        if (targetTaskList.isEmpty()) {
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

        return (targetTaskList.tasks as Task[]).map((value, index) => {
            const labelId = `checkbox-list-label-${value.id}`;
            return (
                <TaskItem
                    showPlannedOn={SettingsStateStore.isShowAllTasks()}
                    key={labelId}
                    task={value}/>
            );
        })
    }

    return (
        <div>
            <AppAccordion
                id={`${targetTaskList.title}-task`}
                initialExpanded={true}
                summary={
                    <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                        {targetTaskList.title.toUpperCase()}
                    </Typography>}
                details={
                    <List className={classes.list}>
                        {getTasks()}
                    </List>
                }/>
        </div>
    );
}
