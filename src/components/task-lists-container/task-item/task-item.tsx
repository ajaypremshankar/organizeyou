import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {Task} from "../../../types/types";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import AddNewTask from "../../add-task-container/add-new-task/add-new-task";
import EditTask from "../../edit-task/edit-task";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        itemText: {
            fontWeight: 'bold',
            font: 'inherit',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
        },
        textField: {
            width: '100%',
        },
    }),
);

interface TaskItemProps {
    task: Task
    update: (task: Task) => void
    complete: (task: Task) => void
}

export default function TaskItem(props: TaskItemProps) {

    const classes = useStyles();
    const [taskItemState, setTaskItemState] = useState({
        element: <span>{props.task.value}</span>,
        editMode: false
    });

    const updateTask = (value: string) => {

        props.update({
            ...props.task,
            value: value
        })
        setTaskItemState({
            ...taskItemState,
            element: <span>{value}</span>,
        })

    }

    const handleEditBlur = () => {
        setTaskItemState({
            ...taskItemState,
            element: <span>{props.task.value}</span>,
            editMode: false
        })
    }

    const handleEditClick = () => {

        setTaskItemState(
            {
                ...taskItemState,
                element: <EditTask
                    editBlur={handleEditBlur}
                    defaultValue={props.task.value}
                    updateTask={updateTask}/>,
                editMode: !taskItemState.editMode
            }
        )
    }

    const labelId = `task-item-label-${props.task.id}`;
    return (
        <ListItem
            key={labelId}
            role={undefined} dense>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    inputProps={{'aria-labelledby': labelId}}
                    onClick={() => props.complete(props.task)}
                />
            </ListItemIcon>
            <ListItemText
                className={classes.itemText}
                id={labelId}
                primary={taskItemState.element}
            />
            {!taskItemState.editMode && <ListItemSecondaryAction>
                <IconButton edge="start" aria-label="edit" onClick={handleEditClick}>
                    <EditIcon/>
                </IconButton>
            </ListItemSecondaryAction>
            }
        </ListItem>
    );
}
