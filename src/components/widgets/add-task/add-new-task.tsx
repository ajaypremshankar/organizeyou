import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { KeyTitleUtils } from "../../../utils/key-title-utils";
import Button from '@material-ui/core/Button';
import AppDialog from "../../common/app-dialog";
import TaskFrequencyOptions from "./task-frequency";
import { TASK_FREQUENCY_TYPE } from "../../../types/types";
import { formatToDay, formatToListTitle } from "../../../utils/date-utils";
import { ordinalSuffixOf } from "../../../utils/object-utils";
import RepeatIcon from '@material-ui/icons/Repeat';

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
            float: 'right',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
        },
        button: {
            width: '15%',
            minHeight: '55px',
            marginRight: '15px',
            textTransform: 'none',
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

    function getLabel() {

        switch (props.taskFrequency) {
            case TASK_FREQUENCY_TYPE.DAILY:
                return `Add task to ${KeyTitleUtils.getTitleByKey(props.date)} (repeats every-day)`;
            case TASK_FREQUENCY_TYPE.WEEKDAYS:
                return `Add task to ${KeyTitleUtils.getTitleByKey(props.date)} (repeats mon to fri)`;
            case TASK_FREQUENCY_TYPE.WEEKLY:
                return `Add task to ${KeyTitleUtils.getTitleByKey(props.date)} (repeats every ${formatToDay(props.date)})`;
            case TASK_FREQUENCY_TYPE.MONTHLY:
                return `Add task to ${KeyTitleUtils.getTitleByKey(props.date)} (repeats monthly on ${ordinalSuffixOf(props.date % 100)})`;
            case TASK_FREQUENCY_TYPE.YEARLY:
                return `Add task to ${KeyTitleUtils.getTitleByKey(props.date)} (repeats yearly on ${formatToListTitle(props.date, false)})`;
            default:
                return `Add task for ${KeyTitleUtils.getTitleByKey(props.date)}`;
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
                color={"primary"}
                variant={TASK_FREQUENCY_TYPE.NO_REPEAT !== props.taskFrequency ? 'contained' : 'outlined'}
                className={classes.button}
                onClick={() => setShowTaskFrequencyOptions(true)}
                size={'large'}
                startIcon={<RepeatIcon fontSize={"large"}/>}>
                {props.taskFrequency}
            </Button>

            <TextField
                className={classes.textField}
                id="outlined-basic"
                label={getLabel()}
                variant="outlined"
                size={'medium'}
                autoComplete={'off'}
                color={"primary"}
                value={taskContentState}
                autoFocus
                inputProps={{minLength: 1, maxLength: process.env.REACT_APP_TASK_MAX_LIMIT}}
                onChange={(event) => setTaskContentState(event.target.value)}
                onKeyDown={handleKeyPressChange}/>
        </div>
    );
}
