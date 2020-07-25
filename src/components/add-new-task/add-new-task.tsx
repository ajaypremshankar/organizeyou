import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Fade from '@material-ui/core/Fade';
import {getDayTypeFromDate} from "../../utils/date-utils";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {format, parse} from "date-fns";
import Grid from '@material-ui/core/Grid';
import {DayType, Task} from "../../types/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 600,
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        textField: {
            maxWidth: 600,
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        addButton: {
            '& > *': {
                margin: theme.spacing(1),
            }
        }
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
            date: props.date
        }
    );

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setAddTaskState(
                {
                    ...addTaskState,
                    date: format(date, 'dd/MM/yyyy')
                })
        }
    };

    const handleValueChange = (event: React.KeyboardEvent<HTMLInputElement>) => {

        if (event.key === 'Enter') {

            props.addTask({
                id: new Date().getMilliseconds(),
                plannedDate: props.date,
                value: addTaskState.content
            })
        }
    }

    return (
        <Fade in={props.showAdd}>
            <Grid container justify="space-around">

                <form className={classes.container} noValidate>

                    <TextField
                        className={classes.textField}
                        id="outlined-basic"
                        label={`Add for ${getDayTypeFromDate(props.date)}`}
                        variant="outlined"
                        size={'medium'}
                        fullWidth={true}
                        onChange={(event) => setAddTaskState(
                            {
                                ...addTaskState,
                                content: event.target.value
                            })}
                        onKeyDown={handleValueChange}
                    />

                    {getDayTypeFromDate(props.date) === DayType.LATER &&

                    <MuiPickersUtilsProvider utils={DateFnsUtils}>

                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date"
                            autoOk={true}
                            value={parse(addTaskState.date, 'dd/MM/yyyy', new Date())}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    }
                </form>
            </Grid>
        </Fade>
    );
}
