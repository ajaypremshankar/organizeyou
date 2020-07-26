import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import {Task} from "../../types/types";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TaskItem from "../task-item/task-item";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: '100%',
            margin: 'auto',
            maxWidth: 600,
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            textAlign: 'left',
            width: '100%',
            margin: 'auto',
            maxWidth: 600,
        }
    }),
);

interface DateTasks {
    title: string;
    tasks: Task[]
    update: (task: Task) => void
    complete: (task: Task) => void
}

export default function DayBasedTaskList(props: DateTasks) {

    const classes = useStyles();

    return (
        <div>
            <Typography variant="subtitle1" gutterBottom className={classes.title}>
                {props.title.toUpperCase()}:
            </Typography>
            <List className={classes.list}>
                {props.tasks.map((value, index) => {
                    const labelId = `checkbox-list-label-${index}`;

                    return (
                        <TaskItem update={props.update} key={labelId} task={value} complete={props.complete} />
                    );
                })}
            </List>
        </div>
    );
}
