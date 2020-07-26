import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Fade from '@material-ui/core/Fade';
import {
    eitherTodayOrTomorrow,
    formatToDDMMyyyy,
    parseFromDDMMyyyy
} from "../../utils/date-utils";
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import {Task} from "../../types/types";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            margin: 'auto',
            align: 'center',
            maxWidth: 600,
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        textField: {
            minWidth: 300,
            maxWidth: 600,
            '& > *': {
                margin: theme.spacing(1),
            },
        },

        datePicker: {
            minWidth: 100,
            maxWidth: 200,
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }),
);

interface AddNewTaskProps {
    showAdd: boolean,
    date: string,
    addTask: (task: Task) => void
}

export default function AddNewTask(props: AddNewTaskProps) {
    const classes = useStyles();

    const [addTaskState, setAddTaskState] = useState(
        {
            content: '',
            date: parseFromDDMMyyyy(props.date),
        }
    );

    const [datePickerState, setDatePickerState] = useState(
        !eitherTodayOrTomorrow(parseFromDDMMyyyy(props.date))
    );

    const handleDateChange = (date: Date | null) => {
        if (date) {
            console.log(date)
            setAddTaskState(
                {
                    ...addTaskState,
                    date: date,
                })
        }

        setDatePickerState(!datePickerState)
    };

    const handleValueChange = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === 'Enter') {

            props.addTask({
                id: new Date().getMilliseconds(),
                plannedOn: formatToDDMMyyyy(addTaskState.date),
                value: addTaskState.content
            })
        }
    }

    return (
        <Fade in={props.showAdd}>
            <Grid className={classes.container} container justify="space-around">
                <div>
                    <MuiPickersUtilsProvider
                        utils={DateFnsUtils}>

                        <DatePicker
                            disableToolbar
                            disablePast
                            variant="dialog"
                            label="I'll perform task on"
                            value={addTaskState.date}
                            onChange={handleDateChange}
                            autoOk={true}
                            disabled={!datePickerState}
                            open={datePickerState}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <TextField
                    className={classes.textField}
                    id="outlined-basic"
                    label={'Start typing task'}
                    variant="outlined"
                    size={'medium'}
                    focused={!datePickerState}
                    onChange={(event) => setAddTaskState(
                        {
                            ...addTaskState,
                            content: event.target.value
                        })}
                    onKeyDown={handleValueChange}
                />
            </Grid>
        </Fade>
    );
}
