import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import {CompletedTask, Task} from "../../types/types";
import {formatToDDMMyyyy} from "../../utils/date-utils";

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
        },
        listItem: {
            textDecoration: 'line-through'
        },
        inline: {
            display: 'inline',
        },
    }),
);

interface DateTasks {
    title: string;
    tasks: CompletedTask[]
}

export default function CompletedTaskList(props: DateTasks) {

    const classes = useStyles();

    return (
        <div>
            <Typography variant="subtitle1" gutterBottom className={classes.title}>
                {props.title.toUpperCase()}:
            </Typography>
            <List className={classes.list}>
                {props.tasks.map((value, index) => {
                    const labelId = `checkbox-list-label-${index}`;

                    return (
                        <ListItem
                            divider={true}
                            key={labelId}
                            role={undefined} dense button>
                            <ListItemText
                                className={classes.listItem}
                                id={labelId}
                                primary={value.value}
                                secondary={` — On ${formatToDDMMyyyy(value.completedDate, true)}`}
                            />
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}
