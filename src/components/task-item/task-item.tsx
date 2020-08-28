import React, { useEffect, useState } from 'react';
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
import { AppStateService } from "../../state-stores/tasks/app-state-service";
import { SettingsStateService, SettingsType } from "../../state-stores/settings/settings-state";
import { TagUtils } from "../../utils/tag-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        itemText: {
            font: 'inherit',
            width: '92%',
            cursor: 'pointer',
            fontWeight: SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? 'bold' : 'normal',
            fontSize: '16px',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
            wordWrap: 'break-word'
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
    return (
        <span>
            {value}
            <span style={{color: 'lightgray', font: 'caption'}}>
                {props.showPlannedOn ? ` (planned on ${formatToListTitle(props.task.plannedOn)})` : ''}
            </span>
        </span>)
}

export default function TaskItem(props: TaskItemProps) {

    const classes = useStyles();
    const [taskItemState, setTaskItemState] = useState({
        element: getTaskContentWithTooltip(props.task.value, props),
        editMode: false
    });

    useEffect(() => {
        setTaskItemState({
            ...taskItemState,
            element: getTaskContentWithTooltip(props.task.value, props)
        })
    }, [props])

    const [datePickerState, setDatePickerState] = useState(false);

    const handleTaskDateChange = (newPlannedOn: number) => {

        if (newPlannedOn !== props.task.plannedOn) {
            AppStateService.handleTaskMovement(props.task.plannedOn,
                {
                    ...props.task,
                    plannedOn: newPlannedOn,
                    updatedOn: getCurrentMillis()
                })
            setTaskItemState({
                ...taskItemState,
                element: <span>{props.task.value}</span>,
            })
        }

        setDatePickerState(!datePickerState)
    };

    const handleTaskCompletion = () => {
        AppStateService.handleTaskCompletion({
            ...props.task,
            updatedOn: getCurrentMillis(),
            completedDate: getCurrentMillis()
        })
    };

    const updateTask = (value: string) => {
        const tags = TagUtils.getTags(value)
        AppStateService.handleTaskAdditionOrUpdation(props.task,
            {
                ...props.task,
                value: value,
                updatedOn: getCurrentMillis(),
                tags: tags,
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

        if (!taskItemState.editMode) {
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
                    size={"small"}
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    inputProps={{'aria-labelledby': labelId}}
                    onClick={handleTaskCompletion}
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
                    <Tooltip title="Move task to other date" aria-label={`change-date-tooltip-${labelId}`}>
                        <EventIcon fontSize={"small"}/>
                    </Tooltip>
                </IconButton>
                <IconButton edge="end" aria-label={`delete-${labelId}`}
                            onClick={() => AppStateService.handleTaskDeletion(props.task)}>
                    <Tooltip title="Delete task" aria-label={`delete-task-tooltip-${labelId}`}>
                        <DeleteIcon fontSize={"small"}/>
                    </Tooltip>
                </IconButton>
            </ListItemSecondaryAction>}
        </ListItem>
    );
}
