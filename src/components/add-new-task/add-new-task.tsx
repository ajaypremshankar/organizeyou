import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import {getDayTypeFromDate} from "../../utils/utils";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import {format, parse} from "date-fns";
import Grid from '@material-ui/core/Grid';
import {DayType} from "../../types/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
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
    addTask: any
}

export default function AddNewTask(props: AddNewTaskProps) {
    const classes = useStyles();

    console.log(props)

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

    return (
        <Fade in={props.showAdd}>
            <Grid container justify="space-around">

                <form className={classes.container} noValidate>

                    <TextField
                        id="outlined-basic"
                        label={`Add: ${getDayTypeFromDate(props.date)}`}
                        variant="outlined"
                        onChange={(event) => setAddTaskState(
                            {
                                ...addTaskState,
                                content: event.target.value
                            })}
                    />

                    {getDayTypeFromDate(props.date) === DayType.OTHER &&

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
                    <Button
                        variant="outlined"
                        color="primary"
                        className={classes.addButton}
                        onClick={() => props.addTask({
                            date: props.date,
                            content: addTaskState.content
                        })}>
                        Add
                    </Button>
                </form>
            </Grid>
        </Fade>
    );
}
