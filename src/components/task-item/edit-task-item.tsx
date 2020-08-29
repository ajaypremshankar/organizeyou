import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            font: 'inherit',
            width: '100%',
            wordWrap: 'break-word'
        },
    }),
);

interface AddNewTaskProps {
    defaultValue: string,
    editBlur: () => void
    updateTask: (value: string) => void
}

export default function EditTaskItem(props: AddNewTaskProps) {
    const classes = useStyles();

    const [taskContentState, setTaskContentState] = useState(props.defaultValue || '');

    const handleKeyPressChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            props.editBlur()
        } else if (taskContentState.trim() !== '' && event.key === 'Enter') {
            props.updateTask(taskContentState.trim())
            setTaskContentState('')
        }
    }

    return (
        <InputBase
            autoFocus
            multiline
            className={classes.textField}
            id="input-base-edit-task"
            defaultValue={taskContentState}
            inputProps={{
                'aria-label': 'naked',
                minLength: 1,
                maxLength: process.env.REACT_APP_TASK_MAX_LIMIT
            }}
            // Set focus to end of the task
            onFocus={event => event.target.selectionStart = taskContentState.length}
            onBlur={props.editBlur}
            onChange={(event) => setTaskContentState(event.target.value)}
            onKeyDown={handleKeyPressChange}
        />
    );
}
