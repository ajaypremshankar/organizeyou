import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {
    eitherTodayOrTomorrow,
    formatFromKeyToDisplayable,
    formatToDDMMyyyy,
    getToday,
    getTomorrow,
} from "../../../utils/date-utils";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: '100%'
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

interface TopButtonGroupProps {
    selectedDate: string,
    chooseDate: (date: string) => void,
}

export default function TopButtonGroup(props: TopButtonGroupProps) {
    const classes = useStyles()

    const [datePickerState, setDatePickerState] = useState(false);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            props.chooseDate(formatToDDMMyyyy(date))
        }
        setDatePickerState(!datePickerState)
    };

    return (
            <div className={classes.fullWidth}>
                <ButtonGroup
                    size="large"
                    color="primary"
                    aria-label="large primary button group"
                    fullWidth={true}>

                    <div style={{display: 'none'}}>
                        <MuiPickersUtilsProvider
                            utils={DateFnsUtils}>
                            <DatePicker
                                disableToolbar
                                disablePast
                                variant="dialog"
                                label="I'll perform task on"
                                value={props.selectedDate}
                                onChange={handleDateChange}
                                autoOk={true}
                                open={datePickerState}
                                onClose={()=>setDatePickerState(false)}
                            />
                        </MuiPickersUtilsProvider>
                    </div>

                    <Button
                        variant={props.selectedDate === getToday() ? 'contained': 'outlined'}
                        onClick={() => props.chooseDate(getToday())}>Today</Button>
                    <Button
                        variant={props.selectedDate === getTomorrow() ? 'contained': 'outlined'}
                        onClick={() => props.chooseDate(getTomorrow())}>Tomorrow</Button>
                    <Button
                        startIcon={<CalendarTodayIcon/>}
                        variant={!eitherTodayOrTomorrow(props.selectedDate) ? 'contained': 'outlined'}
                        onClick={() => {
                            setDatePickerState(true)
                        }}>{!eitherTodayOrTomorrow(props.selectedDate) ? formatFromKeyToDisplayable(props.selectedDate) : 'Date'}</Button>
                </ButtonGroup>
            </div>
    );
}
