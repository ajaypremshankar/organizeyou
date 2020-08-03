import React, { useState } from 'react';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { CompletedTask } from "../../types/types";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import RestoreIcon from '@material-ui/icons/Restore';
import { DisplayableTaskList } from "../../types/displayable-task-list";
import { formatToListTitle } from "../../utils/date-utils";

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

const Accordion = withStyles({
    root: {
        border: '0px solid rgba(0, 0, 0, .125)',
        marginBottom: '20px',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);

interface CompletedTaskProps {
    content: DisplayableTaskList
    undoComplete: (task: CompletedTask) => void,
}

export default function CompletedTaskList(props: CompletedTaskProps) {

    const classes = useStyles();
    const [expanded, setExpanded] = useState(false)

    const handleChange = () => {
        setExpanded(!expanded)
    };

    return (
        <div>
            <Accordion square expanded={expanded} onChange={handleChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="completed-task-content"
                    id="completed-task-header"
                >
                    <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                        {props.content.title.toUpperCase()}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List className={classes.list}>
                        {
                            (props.content.tasks as CompletedTask[])
                                .map((value, index) => {
                                    const labelId = `completed-task-list-label-${value.id}`;

                                    return (
                                        <ListItem
                                            divider={true}
                                            key={labelId}
                                            role={undefined} dense button>
                                            <ListItemText
                                                id={labelId}
                                                primaryTypographyProps={{style: {
                                                        textDecoration: 'line-through'
                                                    }}}
                                                primary={value.value}
                                                secondary={` — On ${formatToListTitle(new Date(value.completedDate))}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="start" aria-label="restore"
                                                            onClick={() => props.undoComplete(value)}>
                                                    <RestoreIcon/>
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    );
                                })}
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
