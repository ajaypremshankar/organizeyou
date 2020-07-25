import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import {Task} from "../../types/types";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: '100%',
            margin: 'auto',
            maxWidth: 600,
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            textAlign: 'left',
            width: '100%',
            margin: 'auto',
            maxWidth: 600,
        }
    }),
);

interface DateTasks {
    title: string;
    tasks: Task[]
    complete: (task: Task) => void
}

export default function DayBasedTaskList(props: DateTasks) {


    const classes = useStyles();

    const tasks = Array.from(props.tasks)

    return (
        <div>
            <Typography variant="subtitle1" gutterBottom className={classes.title}>
                {props.title.toUpperCase()}:
            </Typography>
            <List className={classes.list}>
                {tasks.map((value, index) => {
                    const labelId = `checkbox-list-label-${index}`;

                    return (
                        <ListItem
                            divider={true}
                            key={labelId}
                            role={undefined} dense button onClick={() => props.complete(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{'aria-labelledby': labelId}}
                                />
                            </ListItemIcon>
                            {console.log(value.value)}
                            <ListItemText id={labelId} primary={value.value}/>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}
