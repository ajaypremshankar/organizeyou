import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyTitleUtils } from "../../../utils/key-title-utils";
import Button from '@material-ui/core/Button';
import AppDialog from "../../common/app-dialog";
import TaskFrequencyOptions from "./task-frequency";
import { TASK_FREQUENCY_TYPE } from "../../../types/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            textAlign: 'left',
        },
        textField: {
            width: '80%',
            fontWeight: 'bold',
            fontSize: '16px',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
        },
        button: {
            width: '18%',
            minHeight: '55px',
            marginRight: '15px',
        }
    }),
);

interface AddNewTaskProps {
    date: number,
    addTask: (value: string) => void
    taskFrequency: TASK_FREQUENCY_TYPE
    changeTaskFrequency: (tf: TASK_FREQUENCY_TYPE) => void
}

export default function AddNewTask(props: AddNewTaskProps) {
    const classes = useStyles();
    const [taskContentState, setTaskContentState] = useState('');

    const [showTaskFrequencyOptions, setShowTaskFrequencyOptions] = useState(false);

    const selectFrequency = (tf: TASK_FREQUENCY_TYPE) => {
        props.changeTaskFrequency(tf)
        setShowTaskFrequencyOptions(false)
    }

    const handleKeyPressChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (taskContentState.trim() !== '' && event.key === 'Enter') {
            props.addTask(taskContentState.trim())
            setTaskContentState('')
        }
    }

    return (
        <div className={classes.root}>
            <span style={{display: 'none'}}>
                <AppDialog
                    open={showTaskFrequencyOptions}
                    title={<span>Repeat</span>}
                    content={
                        <TaskFrequencyOptions
                            taskFrequency={props.taskFrequency}
                            selectFrequency={selectFrequency}/>}
                    actions={<span></span>}
                    onClose={() => setShowTaskFrequencyOptions(false)}/>
                </span>
            <Button
                variant="outlined"
                className={classes.button}
                onClick={() => setShowTaskFrequencyOptions(true)}
                size={'large'}>{TASK_FREQUENCY_TYPE[props.taskFrequency]}</Button>

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
                onKeyDown={handleKeyPressChange}/>
        </div>
    );
}
