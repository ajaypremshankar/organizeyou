import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {Task} from "../../types/types";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import {formatToDDMMyyyy} from "../../utils/date-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({}),
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
        editMode: false,
    });

    let updatedValue = {content: props.task.value}

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === 'Enter') {
            setTaskItemState({
                ...taskItemState,
                editMode: false
            })

            props.update({
                ...props.task,
                value: updatedValue.content
            })
        }
    }

    const handleEditClick = () => {
        setTaskItemState(
            {
                ...taskItemState,
                element: <TextField
                    id={props.task.value}
                    defaultValue={updatedValue.content}
                    onChange={(event) => updatedValue.content = event.target.value}
                    onKeyDown={handleKeyDown}
                />,
                editMode: true
            }
        )
    }

    const labelId = `task-item-label-${props.task.id}`;
    return (
        <ListItem
            divider={true}
            key={labelId}
            role={undefined} dense button>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    inputProps={{'aria-labelledby': labelId}}
                    onClick={() => props.complete(props.task)}
                />
            </ListItemIcon>
            <ListItemText id={labelId} primary={taskItemState.element}/>
            {!taskItemState.editMode && <ListItemSecondaryAction>
                <IconButton edge="start" aria-label="edit" onClick={handleEditClick}>
                    <EditIcon/>
                </IconButton>
            </ListItemSecondaryAction>
            }
        </ListItem>
    );
}
