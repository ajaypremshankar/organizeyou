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
import { AppStateService } from "../../state-stores/tasks/app-state-service";
import { SettingsStateService, SettingsType } from "../../state-stores/settings/settings-state";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import { AppStateFacade } from "../../state-stores/app-state-facade";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: '100%',
            margin: 'auto',
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            textAlign: 'left',
            fontSize: theme.typography.pxToRem(15),
            width: '100%',
            margin: 'auto',
            flexShrink: 0,
            fontWeight: 'bold',
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

    const completedTasks = AppStateService.getCompletedTasks()

    if (completedTasks.isEmpty()) {
        return null
    }

    const handleUndoComplete = (value: CompletedTask) => {
        AppStateFacade.undoCompleteTask(value)
    }

    function getSummary() {
        return <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
            {completedTasks.title.toUpperCase()} {SettingsStateService.isShowAllTasks() ? "" : ` (${AppStateService.getEffectiveTitle().toUpperCase()})`}
        </Typography>;
    }

    function getListItem(value: CompletedTask) {
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
                            textDecoration: 'line-through',
                            fontWeight: SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? 'bold' : 'normal',
                            fontSize: '16px',
                            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
                            width: '92%',
                            cursor: 'pointer',
                            wordWrap: 'break-word'
                        }
                    }}
                    primary={value.value}
                    secondary={` — On ${formatToListTitle(new Date(value.completedDate))}`}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="start" aria-label={`restore-task-${labelId}`}
                                onClick={() => handleUndoComplete(value)}>
                        <Tooltip title="Undo complete"
                                 aria-label={`restore-task-tooltip-${labelId}`}>
                            <RestoreIcon/>
                        </Tooltip>
                    </IconButton>
                    <IconButton edge="end" aria-label={`delete-task-${labelId}`}
                                onClick={() => AppStateFacade.deleteCompletedTask(value)}>
                        <Tooltip title="Delete task" aria-label={`delete-task-tooltip-${labelId}`}>
                            <DeleteIcon fontSize={"small"}/>
                        </Tooltip>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }

    function getDetails() {
        return <List className={classes.list}>
            {
                (completedTasks.tasks as CompletedTask[])
                    .map((value, index) => {

                        return getListItem(value);
                    })}
        </List>;
    }

    return (
        <div>
            <AppAccordion
                id={'completed-task'}
                initialExpanded={false}
                summary={getSummary()}
                details={getDetails()}
            />
        </div>
    );
}
