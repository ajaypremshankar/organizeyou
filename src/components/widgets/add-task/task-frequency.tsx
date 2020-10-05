import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import { TASK_FREQUENCY_TYPE } from "../../../types/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontSize: '16px',
            fontWeight: 'bold',
            maxWidth: '20%',
            marginLeft: '-10px',
        },
        item: {
            maxWidth: '20%',
            marginBottom: '-8px',
        },
        itemText: {
            marginLeft: '-10px',
        },
    }),
);

interface TaskFrequencyProps {
    taskFrequency: TASK_FREQUENCY_TYPE
    selectFrequency: (tf: TASK_FREQUENCY_TYPE) => void
}

export default function TaskFrequencyOptions(props: TaskFrequencyProps) {
    const classes = useStyles();
    return (<List className={classes.root}>
        {Object.values(TASK_FREQUENCY_TYPE)
            .map(type => <Option
                key={type}
                type={type}
                currentFrequency={props.taskFrequency}
                selectFrequency={props.selectFrequency}/>)}
    </List>);
}

interface OptionProps {
    type: TASK_FREQUENCY_TYPE
    currentFrequency: TASK_FREQUENCY_TYPE
    selectFrequency: (tf: TASK_FREQUENCY_TYPE) => void
}

function Option(props: OptionProps) {
    const classes = useStyles();

    const currentFrequencyIsEquals = (value: TASK_FREQUENCY_TYPE) => {
        return value === props.currentFrequency
    }

    return (
        <div>
            <ListItem
                className={classes.item}
                key={`task-frequency-${props.type}`}
                dense role={undefined} button={true}
                onClick={() => props.selectFrequency(props.type)}>
                <ListItemIcon>
                    <Radio
                        edge="start"
                        tabIndex={-1}
                        checked={currentFrequencyIsEquals(props.type)}
                        inputProps={{'aria-labelledby': `task-frequency-${props.type}`}}/>
                </ListItemIcon>
                <ListItemText
                    className={classes.itemText}
                    id={`task-frequency-${props.type}`}
                    primary={TASK_FREQUENCY_TYPE.NO_REPEAT !== props.type ? props.type : 'Once'}/>
            </ListItem>
        </div>
    )
}
