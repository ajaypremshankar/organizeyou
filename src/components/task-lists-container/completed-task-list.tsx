import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { CompletedTask } from "../../types/types";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import RestoreIcon from '@material-ui/icons/Restore';
import { formatToListTitle } from "../../utils/date-utils";
import AppAccordion from "../common/app-accordian";
import { StateStore } from "../../types/state-store";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: '100%',
            margin: 'auto',
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            textAlign: 'left',
            width: '100%',
            margin: 'auto',
        },
        inline: {
            display: 'inline',
        },
    }),
);

interface CompletedTaskProps {
}

export default function CompletedTaskList(props: CompletedTaskProps) {

    const classes = useStyles();

    return (
        <div>
            <AppAccordion
                id={'completed-task'}
                initialExpanded={false}
                summary={
                    <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                        {StateStore.getCompletedTasks().title.toUpperCase()}
                    </Typography>
                }
                details={
                    <List className={classes.list}>
                        {
                            (StateStore.getCompletedTasks().tasks as CompletedTask[])
                                .map((value, index) => {
                                    const labelId = `completed-task-list-label-${value.id}`;

                                    return (
                                        <ListItem
                                            divider={true}
                                            key={labelId}
                                            role={undefined} dense button>
                                            <ListItemText
                                                id={labelId}
                                                primaryTypographyProps={{
                                                    style: {
                                                        textDecoration: 'line-through'
                                                    }
                                                }}
                                                primary={value.value}
                                                secondary={` — On ${formatToListTitle(new Date(value.completedDate))}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="start" aria-label="restore"
                                                            onClick={() => StateStore.handleUndoComplete(value)}>
                                                    <RestoreIcon/>
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                    </List>
                }/>
        </div>
    );
}
