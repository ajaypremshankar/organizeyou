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
import { formatToListTitle } from "../../utils/date-utils";
import EventIcon from '@material-ui/icons/Event';
import AppDatePicker from "../common/date-picker";
import { SettingsStateService, SettingsType } from "../../state-stores/settings/settings-state";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { AppStateFacade } from "../../state-stores/app-state-facade";
import RepeatIcon from '@material-ui/icons/Repeat';
import { TaskTemplateStateService } from "../../state-stores/task-template/task-template-state-service";
import Button from "@material-ui/core/Button";
import AppDialog from "../common/app-dialog";

const urlRegex = /(https?:\/\/[^ ]*)/
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        itemText: {
            font: 'inherit',
            width: '92%',
            cursor: 'text',
            fontWeight: SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? 'bold' : 'normal',
            fontSize: '16px',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
            wordWrap: 'break-word',
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
    const testUrl = value.match(urlRegex);
    const onlyUrl = testUrl && testUrl[1];
    const labelId = `task-item-label-${props.task.id}`;
    const frequencyType = props.task.taskTemplateId ? TaskTemplateStateService.getFrequencyById(props.task.taskTemplateId) : undefined

    return (

        <span>
            <Tooltip title="Click to edit" aria-label={`${labelId}-tooltip`}>
                <span>{value}</span>
            </Tooltip>

            <span style={{color: 'lightgray', font: 'caption'}}>
                {props.showPlannedOn || frequencyType ? ` (` : ''}
                {props.showPlannedOn ? `${formatToListTitle(props.task.plannedOn)}` : ''}
                {props.showPlannedOn && frequencyType ? ', ' : ''}
            </span>

            {frequencyType &&
            <span style={{color: 'lightgray', font: 'caption', fontSize: '80%'}}>
                <RepeatIcon style={{fontSize: '100%', verticalAlign: 'middle'}}/>
                &nbsp;{frequencyType}
            </span>}
            <span style={{color: 'lightgray', font: 'caption'}}>
                {props.showPlannedOn || frequencyType ? `)` : ''}
            </span>
            <span>{onlyUrl &&
            <a href={onlyUrl} target={'_blank'} rel={'noopener noreferrer'}>
                <OpenInNewIcon
                    cursor={'pointer'}
                    fontSize={"small"}
                    color={"primary"}></OpenInNewIcon>
            </a>}</span>
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

    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const handleTaskDateChange = (newPlannedOn: number) => {

        if (newPlannedOn !== props.task.plannedOn) {
            AppStateFacade.moveTask(props.task, newPlannedOn)
            setTaskItemState({
                ...taskItemState,
                element: <span>{props.task.value}</span>,
            })
        }

        setDatePickerState(!datePickerState)
    };

    const handleTaskCompletion = () => {
        AppStateFacade.completeTask(props.task)
    };

    const updateTask = (value: string) => {
        AppStateFacade.updateTask(props.task, value)
        setTaskItemState({
            ...taskItemState,
            element: getTaskContentWithTooltip(value, props)
        })
    }

    const handleDeleteTask = (deleteSeries: boolean = false) => {
        AppStateFacade.deleteTask(props.task, deleteSeries)
    }

    const handleDeleteButtonClick = () => {
        setDeleteDialogOpen(true)
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

            <AppDialog
                open={deleteDialogOpen}
                title={<span>Delete task</span>}
                content={
                    <span>
                        {props.task.taskTemplateId ? `Repeats:  ${TaskTemplateStateService.getFrequencyById(props.task.taskTemplateId)}`
                            : ''}
                    </span>}
                actions={
                    <div>
                        {props.task.taskTemplateId ?
                            <Button onClick={() => handleDeleteTask(true)} color="secondary">
                                This and following
                            </Button> :
                            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                                Cancel
                            </Button>}
                        <Button autoFocus onClick={() => handleDeleteTask(false)} color="secondary">
                            This task
                        </Button>
                    </div>}
                onClose={() => setDeleteDialogOpen(false)}/>

            <AppDatePicker
                label={''}
                variant={"dialog"}
                open={datePickerState}
                value={props.task.plannedOn}
                close={() => setDatePickerState(false)}
                dateChange={handleTaskDateChange}/>
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
                            onClick={handleDeleteButtonClick}>
                    <Tooltip title="Delete task."
                             aria-label={`delete-task-tooltip-${labelId}`}>
                        <DeleteIcon fontSize={"small"}/>
                    </Tooltip>
                </IconButton>
            </ListItemSecondaryAction>}
        </ListItem>
    );
}
