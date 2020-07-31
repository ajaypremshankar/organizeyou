import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {Task} from "../../types/types";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditTaskItem from "./edit-task-item";
import Tooltip from '@material-ui/core/Tooltip';
import {formatToListTitle, getCurrentMillis} from "../../utils/date-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        itemText: {
            font: 'inherit',
            width: '100%',
            cursor: 'pointer',
        },
        textField: {
            width: '100%',
        },
    }),
);

interface TaskItemProps {
    listKey: number
    task: Task
    overdue?: boolean
    update: (key: number, task: Task) => void
    complete: (key: number, task: Task) => void
    delete: (key: number, task: Task) => void
}

export default function TaskItem(props: TaskItemProps) {

    const classes = useStyles();
    const [taskItemState, setTaskItemState] = useState({
        element: <span>{props.task.value}</span>,
        editMode: false
    });

    const updateTask = (value: string) => {
        props.update(props.listKey,
            {
                ...props.task,
                value: value,
                updatedOn: getCurrentMillis()
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
                element: <EditTaskItem
                    editBlur={handleEditBlur}
                    defaultValue={props.task.value}
                    updateTask={updateTask}/>,
                editMode: !taskItemState.editMode
            }
        )
    }

    const getTaskText = () => {
        return (<span>
            {taskItemState.element}
            <span style={{color: 'lightgray', font: 'caption'}}>
                {props.overdue ? ` (since ${formatToListTitle(props.task.plannedOn)})` : ''}
            </span>
        </span>)
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
                    onClick={() => props.complete(props.listKey, props.task)}
                />
            </ListItemIcon>
            <Tooltip title="Click to edit task"
                     aria-label="task-item-edit-tool-tip">
                <ListItemText
                    className={classes.itemText}
                    id={labelId}
                    classes={{primary: classes.itemText}}
                    primary={getTaskText()}
                    //secondary={props.overdue ? `${formatToListTitle(props.task.plannedOn)}` : ''}
                    onClick={handleEditClick}
                />
            </Tooltip>
            {!taskItemState.editMode &&
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label={`delete-${labelId}`}
                            onClick={() => props.delete(props.listKey, props.task)}>
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>}
        </ListItem>
    );
}
