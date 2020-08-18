import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyTitlePair } from "../../../types/key-title-pair";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            width: '100%',
        },
    }),
);

interface AddNewTaskProps {
    keyTitle: KeyTitlePair,
    addTask: (value: string) => void
}

export default function AddNewTask(props: AddNewTaskProps) {
    const classes = useStyles();

    const [taskContentState, setTaskContentState] = useState('');

    const handleKeyPressChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (taskContentState.trim() !== '' && event.key === 'Enter') {
            props.addTask(taskContentState)
            setTaskContentState('')
        }
    }

    return (
        <TextField
            className={classes.textField}
            id="outlined-basic"
            label={`Add task for ${props.keyTitle.title}`}
            variant="outlined"
            size={'medium'}
            autoComplete={'off'}
            value={taskContentState}
            autoFocus
            inputProps={{minLength: 1, maxLength: process.env.REACT_APP_TASK_MAX_LIMIT}}
            onChange={(event) => setTaskContentState(event.target.value)}
            onKeyDown={handleKeyPressChange}
        />
    );
}
