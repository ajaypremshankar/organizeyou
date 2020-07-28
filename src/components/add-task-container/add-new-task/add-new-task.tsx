import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {getListTitleFromKey} from "../../../utils/date-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textField: {
            width: '100%',
        },
    }),
);

interface AddNewTaskProps {
    date: string,
    addTask: (value: string) => void
}

export default function AddNewTask(props: AddNewTaskProps) {
    const classes = useStyles();

    const [taskContentState, setTaskContentState] = useState('');

    const handleKeyPressChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            props.addTask(taskContentState)
            setTaskContentState('')
        }
    }

    return (
        <TextField
            className={classes.textField}
            id="outlined-basic"
            label={`Add task for ${getListTitleFromKey(props.date)}`}
            variant="outlined"
            size={'medium'}
            value={taskContentState}
            autoFocus
            onChange={(event) => setTaskContentState(event.target.value)}
            onKeyDown={handleKeyPressChange}
        />
    );
}
