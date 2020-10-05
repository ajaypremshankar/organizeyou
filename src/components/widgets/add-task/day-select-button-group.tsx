import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import {
    getNextDayKey, getPrevDayKey,
    getTodayKey,
    getTomorrowKey,
    isPastKey,
    neitherTodayNorTomorrow
} from "../../../utils/date-utils";
import { KeyTitleUtils } from "../../../utils/key-title-utils";
import DateFrequencyPicker from "./date-frequency-picker";
import { DateAndFrequency } from "./add-task-widget";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

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
    dateAndFrequency: DateAndFrequency,
    onSelect: (df: DateAndFrequency) => void,
}

export default function DaySelectButtonGroup(props: DaySelectButtonGroupProps) {
    const classes = useStyles()

    const [datePickerState, setDatePickerState] = useState(false);

    const chooseDate = (date: number) => {
        props.onSelect({
            ...props.dateAndFrequency,
            date: date
        })
    }

    const handleSelect = (df: DateAndFrequency) => {
        props.onSelect(df)
        setDatePickerState(false)
    }

    return (
        <div className={classes.fullWidth}>

            {datePickerState && <DateFrequencyPicker
                dateAndFrequency={props.dateAndFrequency}
                mode={"add"}
                open={datePickerState}
                onSelect={handleSelect}
                onClose={() => setDatePickerState(false)}/>}

            <ButtonGroup
                size="large"
                disableRipple
                disableFocusRipple
                disableElevation
                color="primary"
                className={classes.buttonGroup}
                aria-label="large button group"
                fullWidth={true}>
                <Button
                    disabled={props.dateAndFrequency.date === getTodayKey()}
                    style={{width: '2%'}}
                    variant={'outlined'}
                    onClick={() => chooseDate(getPrevDayKey(props.dateAndFrequency.date))}><NavigateBeforeIcon/></Button>
                <Button
                    style={{width: '90%'}}
                    variant={props.dateAndFrequency.date === getTodayKey() ? 'contained' : 'outlined'}
                    onClick={() => chooseDate(getTodayKey())}>Today</Button>
                <Button
                    variant={props.dateAndFrequency.date === getTomorrowKey() ? 'contained' : 'outlined'}
                    onClick={() => chooseDate(getTomorrowKey())}>Tomorrow</Button>
                <Button
                    style={{width: '90%'}}
                    startIcon={<CalendarTodayIcon/>}
                    variant={neitherTodayNorTomorrow(props.dateAndFrequency.date) ? 'contained' : 'outlined'}
                    onClick={() => {
                        setDatePickerState(true)
                    }}>{!isPastKey(props.dateAndFrequency.date) && neitherTodayNorTomorrow(props.dateAndFrequency.date) ? KeyTitleUtils.getTitleByKey(props.dateAndFrequency.date) : 'Date'}</Button>
                <Button
                    style={{width: '2%'}}
                    variant={'outlined'}
                    onClick={() => chooseDate(getNextDayKey(props.dateAndFrequency.date))}><NavigateNextIcon/></Button>
            </ButtonGroup>
        </div>
    );
}
