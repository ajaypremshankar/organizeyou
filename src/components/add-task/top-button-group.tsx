import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { formatToKey, getTodayKey, getTomorrowKey, neitherTodayNorTomorrow } from "../../utils/date-utils";
import { KeyTitlePair } from "../../types/key-title-pair";
import AppDatePicker from "../common/date-picker";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: '100%'
        },
        datePicker: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
    }),
);

interface TopButtonGroupProps {
    keyTitle: KeyTitlePair,
    chooseDate: (date: number) => void,
}

export default function TopButtonGroup(props: TopButtonGroupProps) {
    const classes = useStyles()

    const [datePickerState, setDatePickerState] = useState(false);
    const handleDateChange = (key: number) => {
        props.chooseDate(key)
    };

    return (
        <div className={classes.fullWidth}>
            <ButtonGroup
                size="large"
                color="primary"
                aria-label="large primary button group"
                fullWidth={true}>

                <AppDatePicker
                    label={''}
                    open={datePickerState}
                    value={props.keyTitle.key + 2}
                    dateChange={handleDateChange}
                    close={() => setDatePickerState(false)}
                />

                <Button
                    variant={props.keyTitle.key === getTodayKey() ? 'contained' : 'outlined'}
                    onClick={() => props.chooseDate(getTodayKey())}>Today</Button>
                <Button
                    variant={props.keyTitle.key === getTomorrowKey() ? 'contained' : 'outlined'}
                    onClick={() => props.chooseDate(getTomorrowKey())}>Tomorrow</Button>
                <Button
                    startIcon={<CalendarTodayIcon/>}
                    variant={neitherTodayNorTomorrow(props.keyTitle.key) ? 'contained' : 'outlined'}
                    onClick={() => {
                        setDatePickerState(true)
                    }}>{neitherTodayNorTomorrow(props.keyTitle.key) ? props.keyTitle.title : 'Date'}</Button>
            </ButtonGroup>
        </div>
    );
}
