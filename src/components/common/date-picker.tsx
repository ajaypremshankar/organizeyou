import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DatePicker, Day, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { formatToKey, parseFromKey } from "../../utils/date-utils";
import { Badge } from "@material-ui/core";
import { Task } from "../../types/types";
import { StateStore } from "../../types/state-store";

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

    const handleDateChange = (date: Date | null) => {
        if (date) {
            props.dateChange(formatToKey(date))
        }
        props.close()
    };

    const tasksMap: Map<number, Task[]> = StateStore.getTasksMap()

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
                    renderDay={(day, selectedDate, isInCurrentMonth, dayComponent) => {
                        if(day == null) return dayComponent

                        const currentKey = formatToKey(day)
                        const tasksOnDay = tasksMap.get(currentKey)
                        const isSelected = isInCurrentMonth && tasksOnDay && tasksOnDay.length > 0;

                        // You can also use our internal <Day /> component
                        return isSelected ? <Badge
                            overlap="circle"
                            style={{fontSize: 'smaller'}}
                            badgeContent={isSelected && tasksOnDay ? tasksOnDay.length : undefined}
                            variant={"dot"}
                            color={"secondary"}>{dayComponent}</Badge> : dayComponent;
                    }}
                />
            </MuiPickersUtilsProvider>
        </div>

    );
}
