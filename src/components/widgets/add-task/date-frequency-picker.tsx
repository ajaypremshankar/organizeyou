import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppDatePicker from "../../common/date-picker";
import TaskFrequencyOptions from "./task-frequency";
import { TASK_FREQUENCY_TYPE } from "../../../types/types";
import AppDialog from "../../common/app-dialog";
import Grid from '@material-ui/core/Grid';
import { DateAndFrequency } from "./add-task-widget";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: '100%',
        },
    }),
);

interface DateFrequencyPickerProps {
    open: boolean
    dateAndFrequency: DateAndFrequency,
    onClose: any
    onSelect: any
}

export default function DateFrequencyPicker(props: DateFrequencyPickerProps) {
    const classes = useStyles()

    const [dateAndFrequencyState, setDateAndFrequencyState] = useState(props.dateAndFrequency)

    const handleFrequencySelect = (selected: TASK_FREQUENCY_TYPE) => {
        setDateAndFrequencyState({
            ...dateAndFrequencyState,
            frequency: selected
        })
    }

    const handleDateSelect = (date: number) => {
        props.onSelect({
            ...dateAndFrequencyState,
            date: date
        })
    }

    function getContent() {
        return (
            <Grid container spacing={0}>
                <Grid item xs={4}>
                    <TaskFrequencyOptions
                        taskFrequency={dateAndFrequencyState.frequency}
                        selectFrequency={handleFrequencySelect}/>
                </Grid>
                <Grid item xs={8}>
                    <AppDatePicker
                        label={''}
                        open={props.open}
                        variant={"static"}
                        value={dateAndFrequencyState.date}
                        dateChange={handleDateSelect}/>
                </Grid>
            </Grid>
        )
    }

    function getActions() {
        return <span></span>;
    }

    return (<AppDialog
            open={props.open}
            title={<span></span>}
            content={getContent()}
            actions={getActions()} onClose={props.onClose}/>
    );
}
