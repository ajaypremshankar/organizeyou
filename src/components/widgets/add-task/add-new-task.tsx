import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyTitleUtils } from "../../../utils/key-title-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            width: '100%',
            fontWeight: 'bold',
            fontSize: '16px',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
        },
    }),
);

interface AddNewTaskProps {
    date: number,
    addTask: (value: string) => void
}

export default function AddNewTask(props: AddNewTaskProps) {
    const classes = useStyles();

    const [taskContentState, setTaskContentState] = useState('');

    const handleKeyPressChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (taskContentState.trim() !== '' && event.key === 'Enter') {
            props.addTask(taskContentState.trim())
            setTaskContentState('')
        }
    }

    return (
        <TextField
            className={classes.textField}
            id="outlined-basic"
            label={`Add task for ${KeyTitleUtils.getTitleByKey(props.date)}`}
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
