import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import { TASK_FREQUENCY_TYPE, TaskFrequencyMeta } from "../../../types/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontSize: '16px',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
        },
    }),
);

interface TaskFrequencyProps {
    taskFrequency: TASK_FREQUENCY_TYPE
    selectFrequency: (tf: TASK_FREQUENCY_TYPE) => void
}

export default function TaskFrequencyOptions(props: TaskFrequencyProps) {
    const classes = useStyles();

    return (
        <List className={classes.root}>
            <Option
                type={TASK_FREQUENCY_TYPE.NO_REPEAT}
                label={'No repeat'}
                currentFrequency={props.taskFrequency}
                selectFrequency={props.selectFrequency}/>

            <Option
                type={TASK_FREQUENCY_TYPE.DAILY}
                label={'Daily'}
                currentFrequency={props.taskFrequency}
                selectFrequency={props.selectFrequency}/>

            <Option
                type={TASK_FREQUENCY_TYPE.EVERY_WEEKDAY}
                label={'Weekday'}
                currentFrequency={props.taskFrequency}
                selectFrequency={props.selectFrequency}/>

            <Option
                type={TASK_FREQUENCY_TYPE.WEEKLY}
                currentFrequency={props.taskFrequency}
                selectFrequency={props.selectFrequency}/>

            <Option
                type={TASK_FREQUENCY_TYPE.MONTHLY_DATE}
                currentFrequency={props.taskFrequency}
                selectFrequency={props.selectFrequency}/>

            <Option
                type={TASK_FREQUENCY_TYPE.MONTHLY_DAY}
                currentFrequency={props.taskFrequency}
                selectFrequency={props.selectFrequency}/>

            <Option
                type={TASK_FREQUENCY_TYPE.YEARLY}
                currentFrequency={props.taskFrequency}
                selectFrequency={props.selectFrequency}/>
        </List>
    );
}

interface OptionProps {
    type: TASK_FREQUENCY_TYPE
    meta: Partial<TaskFrequencyMeta>
    label: string
    currentFrequency: TASK_FREQUENCY_TYPE
    selectFrequency: (tf: TASK_FREQUENCY_TYPE) => void
}

export function Option(props: OptionProps) {

    const currentFrequencyIsEquals = (value: TASK_FREQUENCY_TYPE) => {
        return value === props.currentFrequency
    }

    return (
        <ListItem
            key={`task-frequency-${props.type}`}
            dense role={undefined} button
            onClick={() => props.selectFrequency(props.type)}>
            <ListItemIcon>
                <Radio
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    checked={currentFrequencyIsEquals(props.type)}
                    inputProps={{'aria-labelledby': `task-frequency-${props.type}`}}/>
            </ListItemIcon>
            <ListItemText id={`task-frequency-${props.type}`} primary={props.label}/>
        </ListItem>
    )
}
