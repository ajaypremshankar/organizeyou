import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {Task} from "../../../types/types";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditTask from "../../edit-task/edit-task";
import {getFromKeyToDisplayableDay} from "../../../utils/date-utils";
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        itemText: {
            font: 'inherit',
            width: '100%',
            cursor: 'pointer',
        },
        textField: {
            font: 'inherit',
            width: '100%',
        },
    }),
);

interface TaskItemProps {
    listKey: string
    task: Task
    update: (key: string, task: Task) => void
    complete: (key: string, task: Task) => void
    delete: (key: string, task: Task) => void
}

export default function TaskItem(props: TaskItemProps) {

    const classes = useStyles();
    const [taskItemState, setTaskItemState] = useState({
        element: <span>{props.task.value}</span>,
        editMode: false
    });

    const updateTask = (value: string) => {
        props.update(
            getFromKeyToDisplayableDay(props.listKey),
            {
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
            element: <Tooltip title="Click to edit" aria-label={`tooltip-${labelId}`}>
                <span>{props.task.value}</span>
            </Tooltip>,
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
                    onClick={() => props.complete(getFromKeyToDisplayableDay(props.listKey), props.task)}
                />
            </ListItemIcon>
            <ListItemText
                className={classes.itemText}
                id={labelId}
                primary={taskItemState.element}
                onClick={handleEditClick}
            />
            {!taskItemState.editMode &&
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label={`delete-${labelId}`}
                            onClick={() => props.delete(getFromKeyToDisplayableDay(props.listKey), props.task)}>
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>}
        </ListItem>
    );
}
