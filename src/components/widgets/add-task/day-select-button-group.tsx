import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { getTodayKey, getTomorrowKey, isPastKey, neitherTodayNorTomorrow } from "../../../utils/date-utils";
import { KeyTitleUtils } from "../../../utils/key-title-utils";
import AppDatePicker from "../../common/date-picker";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: '100%',
        },
        datePicker: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        buttonGroup: {
            '&:hover': {
                color: '#FFFF',
            }
        }
    }),
);

interface DaySelectButtonGroupProps {
    date: number,
    chooseDate: (date: number) => void,
}

export default function DaySelectButtonGroup(props: DaySelectButtonGroupProps) {
    const classes = useStyles()

    const [datePickerState, setDatePickerState] = useState(false);
    const handleDateChange = (key: number) => {
        props.chooseDate(key)
    };

    return (
        <div className={classes.fullWidth}>
            <ButtonGroup
                size="large"
                disableRipple
                disableFocusRipple
                disableElevation
                color="primary"
                className={classes.buttonGroup}
                aria-label="large button group"
                fullWidth={true}>

                <AppDatePicker
                    label={''}
                    open={datePickerState}
                    value={getTodayKey() + 2}
                    dateChange={handleDateChange}
                    close={() => setDatePickerState(false)}/>

                <Button
                    variant={props.date === getTodayKey() ? 'contained' : 'outlined'}
                    onClick={() => props.chooseDate(getTodayKey())}>Today</Button>
                <Button
                    variant={props.date === getTomorrowKey() ? 'contained' : 'outlined'}
                    onClick={() => props.chooseDate(getTomorrowKey())}>Tomorrow</Button>
                <Button
                    startIcon={<CalendarTodayIcon/>}
                    variant={neitherTodayNorTomorrow(props.date) ? 'contained' : 'outlined'}
                    onClick={() => {
                        setDatePickerState(true)
                    }}>{ !isPastKey(props.date) && neitherTodayNorTomorrow(props.date) ? KeyTitleUtils.getTitleByKey(props.date) : 'Date'}</Button>
            </ButtonGroup>
        </div>
    );
}
