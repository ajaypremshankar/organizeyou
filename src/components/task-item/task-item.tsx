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
import { formatToListTitle, getCurrentMillis } from "../../utils/date-utils";
import EventIcon from '@material-ui/icons/Event';
import AppDatePicker from "../common/date-picker";
import { StateStore } from "../../types/state-store";

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
}

const getTaskContentWithTooltip = (value: string, props: TaskItemProps) => {
    const labelId = `task-item-label-${props.task.id}`;
    return (
        <Tooltip title="Click to edit" aria-label={`tooltip-${labelId}`}>
                <span>
            {value}
                    <span style={{color: 'lightgray', font: 'caption'}}>
                {props.showPlannedOn ? ` (planned on ${formatToListTitle(props.task.plannedOn)})` : ''}
            </span>
                </span>
        </Tooltip>)
}

export default function TaskItem(props: TaskItemProps) {

    const classes = useStyles();
    const [taskItemState, setTaskItemState] = useState({
        element: getTaskContentWithTooltip(props.task.value, props),
        editMode: false
    });

    const [datePickerState, setDatePickerState] = useState(false);

    const handleTaskDateChange = (newPlannedOn: number) => {
        StateStore.handleTaskMovement(props.task.plannedOn,
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
        StateStore.handleTaskAdditionOrUpdation(props.task.plannedOn,
            {
                ...props.task,
                value: value,
                updatedOn: getCurrentMillis()
            })
        setTaskItemState({
            ...taskItemState,
            element: getTaskContentWithTooltip(value, props)
        })
    }

    const handleEditBlur = () => {
        setTaskItemState({
            ...taskItemState,
            element: getTaskContentWithTooltip(props.task.value, props),
            editMode: false
        })
    }

    const handleEditClick = () => {

        if(!taskItemState.editMode) {
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
                close={() => setDatePickerState(false)}/>

            <ListItemIcon>
                <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    inputProps={{'aria-labelledby': labelId}}
                    onClick={() => StateStore.handleTaskCompletion(props.task.plannedOn, props.task)}
                />
            </ListItemIcon>
            <ListItemText
                className={classes.itemText}
                id={labelId}
                classes={{primary: classes.itemText}}
                primary={taskItemState.element}
                onClick={handleEditClick}
            />
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
                            onClick={() => StateStore.handleTaskDeletion(props.task.plannedOn, props.task)}>
                    <Tooltip title="Click to delete task" aria-label={`delete-task-tooltip-${labelId}`}>
                        <DeleteIcon/>
                    </Tooltip>
                </IconButton>
            </ListItemSecondaryAction>}
        </ListItem>
    );
}
