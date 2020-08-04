import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { formatToKey, parseFromKey } from "../../utils/date-utils";

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

interface AppDatePickerProps {
    label: string
    open: boolean
    value: number
    dateChange: (date: number) => void
    close: () => void
}

export default function AppDatePicker(props: AppDatePickerProps) {
    const classes = useStyles()

    const handleDateChange = (date: Date | null) => {
        if (date) {
            props.dateChange(formatToKey(date))
        }
        props.close()
    };

    return (

        <div style={{display: 'none'}}>
            <MuiPickersUtilsProvider
                utils={DateFnsUtils}>
                <DatePicker
                    disableToolbar
                    disablePast
                    variant="dialog"
                    label={props.label}
                    value={parseFromKey(props.value)}
                    onChange={handleDateChange}
                    autoOk={true}
                    format='yyyyMMdd'
                    open={props.open}
                    onClose={() => props.close()}
                />
            </MuiPickersUtilsProvider>
        </div>

    );
}
