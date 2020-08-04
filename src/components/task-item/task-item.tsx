import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { Task } from "../../types/types";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditTaskItem from "./edit-task-item";
import Tooltip from '@material-ui/core/Tooltip';
import { formatToListTitle, getCurrentMillis, getTodayKey } from "../../utils/date-utils";
import EventIcon from '@material-ui/icons/Event';
import AppDatePicker from "../common/date-picker";

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
    task: Task
    showPlannedOn?: boolean
    move: (from: number, to: number, task: Task) => void
    update: (key: number, task: Task) => void
    complete: (fromKey: number, task: Task) => void
    delete: (fromKey: number, task: Task) => void
}

export default function TaskItem(props: TaskItemProps) {

    const classes = useStyles();
    const [taskItemState, setTaskItemState] = useState({
        element: <span>{props.task.value}</span>,
        editMode: false
    });

    const [datePickerState, setDatePickerState] = useState(false);

    const handleTaskDateChange = (newPlannedOn: number) => {

        props.move(props.task.plannedOn,
            newPlannedOn,
            {
                ...props.task,
                plannedOn: newPlannedOn,
                updatedOn: getCurrentMillis()
            })
        setTaskItemState({
            ...taskItemState,
            element: <span>{props.task.value}</span>,
        })

        setDatePickerState(!datePickerState)
    };

    const updateTask = (value: string) => {
        props.update(props.task.plannedOn,
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
                {props.showPlannedOn ? ` (planned on ${formatToListTitle(props.task.plannedOn)})` : ''}
            </span>
        </span>)
    }

    const labelId = `task-item-label-${props.task.id}`;
    return (
        <ListItem
            key={labelId}
            role={undefined} dense>

            <AppDatePicker
                label={''}
                open={datePickerState}
                value={props.task.plannedOn}
                dateChange={handleTaskDateChange}
                close={() => setDatePickerState(false)}
            />

            <ListItemIcon>
                <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    inputProps={{'aria-labelledby': labelId}}
                    onClick={() => props.complete(props.task.plannedOn, props.task)}
                />
            </ListItemIcon>
            <Tooltip title="Click to edit task"
                     aria-label="task-item-edit-tool-tip">
                <ListItemText
                    className={classes.itemText}
                    id={labelId}
                    classes={{primary: classes.itemText}}
                    primary={getTaskText()}
                    onClick={handleEditClick}
                />
            </Tooltip>
            {!taskItemState.editMode &&
            <ListItemSecondaryAction>
                <IconButton
                    onClick={() => {
                        setDatePickerState(true)
                    }}
                    edge="start" aria-label={`move-${labelId}`}>
                    <Tooltip title="Click to change date" aria-label={`change-date-tooltip-${labelId}`}>
                    <EventIcon/>
                    </Tooltip>
                </IconButton>
                <IconButton edge="end" aria-label={`delete-${labelId}`}
                            onClick={() => props.delete(props.task.plannedOn, props.task)}>
                    <Tooltip title="Click to delete task" aria-label={`delete-task-tooltip-${labelId}`}>
                    <DeleteIcon/>
                    </Tooltip>
                </IconButton>
            </ListItemSecondaryAction>}
        </ListItem>
    );
}
