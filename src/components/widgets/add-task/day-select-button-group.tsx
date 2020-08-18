import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { getTodayKey, getTomorrowKey, neitherTodayNorTomorrow } from "../../../utils/date-utils";
import { KeyTitlePair } from "../../../types/key-title-pair";
import AppDatePicker from "../../common/date-picker";

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
        buttonGroup: {
            '&:hover': {
                color: '#FFFF',
            }
        }
    }),
);

interface DaySelectButtonGroupProps {
    keyTitle: KeyTitlePair,
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
