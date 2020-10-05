import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppDatePicker from "../../common/date-picker";
import TaskFrequencyOptions from "./task-frequency";
import { TASK_FREQUENCY_TYPE } from "../../../types/types";
import AppDialog from "../../common/app-dialog";
import Grid from '@material-ui/core/Grid';
import { DateAndFrequency } from "./add-task-widget";
import Button from "@material-ui/core/Button";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: '100%',
        },
    }),
);

interface DateFrequencyPickerProps {
    open: boolean
    mode: 'add' | 'move'
    title?: string
    dateAndFrequency: DateAndFrequency,
    onClose: any
    onSelect: any
}

export default function DateFrequencyPicker(props: DateFrequencyPickerProps) {
    const classes = useStyles()

    const [dateAndFrequencyState, setDateAndFrequencyState] = useState(props.dateAndFrequency)

    useEffect(() => {
        setDateAndFrequencyState(props.dateAndFrequency)
    }, [props])

    const handleFrequencySelect = (selected: TASK_FREQUENCY_TYPE) => {
        setDateAndFrequencyState({
            ...dateAndFrequencyState,
            frequency: selected
        })
    }

    const handleDateSelect = (date: number) => {
        setDateAndFrequencyState({
            ...dateAndFrequencyState,
            date: date
        })
    }

    const handlePressOk = (moveSeries: boolean) => {
        if (isMoveMode()) {
            props.onSelect(dateAndFrequencyState, moveSeries)
        } else {
            props.onSelect(dateAndFrequencyState)
        }
    }

    function getContent() {
        return (
            <div>
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
            </div>
        )
    }

    function isMoveMode() {
        return props.mode === 'move';
    }

    function getActions() {
        return <div>
            {isMoveMode() ?
                <span>
                    <Button
                        style={{width: 200, marginRight: '20px', marginTop: '-30px'}}
                        onClick={() => handlePressOk(true)} color="primary">
                    This and repeating
                    </Button>
                <Button
                    style={{width: 100, marginRight: '20px', marginTop: '-30px'}}
                    autoFocus onClick={() => handlePressOk(false)} color="primary">
                    Just this
                </Button></span> : <Button
                    variant={"outlined"}
                    style={{width: 100, marginRight: '20px', marginTop: '-30px'}}
                    onClick={() => handlePressOk(false)}>Ok</Button>}
        </div>;
    }

    return (<AppDialog
            open={props.open}
            title={{element: <span style={{fontWeight: "bold"}}>{props.title}</span>}}
            content={{element: getContent()}}
            actions={
                {
                    element: getActions(),
                    style: {textAlign: "right", justifyContent: "flex-end"}
                }
            }
            onClose={props.onClose}/>
    );
}
