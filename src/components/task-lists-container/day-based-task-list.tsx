import React from 'react';
import {createStyles, makeStyles, Theme, withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import {Task} from "../../types/types";
import TaskItem from "./task-item/task-item";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import {DisplayableTaskList} from "../../types/displayable-task-list";

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
            fontSize: theme.typography.pxToRem(15),
            width: '100%',
            margin: 'auto',
            flexShrink: 0,
            fontWeight: 'bold',
        },
        itemText: {
            fontWeight: 'bold',
            fontSize: '16px',
            fontFamily: '"Helvetica-Neue", Helvetica, Arial',
        }
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
            margin: '5px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
    root: {},
}))(MuiAccordionDetails);

interface DateTasks {
    content: DisplayableTaskList
    update: (key: number, task: Task) => void
    complete: (key: number, task: Task) => void
    expanded?: boolean
    delete: (key: number, task: Task) => void
}


export default function DayBasedTaskList(props: DateTasks) {

    const classes = useStyles();
    const getTasks = (tasks : Task[]) => {

        if (tasks.length === 0) {
            return Array.of(<ListItem
                key={'no-items-in-list'}
                role={undefined} dense>
                <ListItemIcon>
                    <DoneAllIcon />
                </ListItemIcon>
                <ListItemText
                    className={classes.itemText}
                    id={'no-item'}
                    primary={'Nothing awaits you here :)'}
                />
            </ListItem>)
        }

        return tasks.map((value, index) => {
            const labelId = `checkbox-list-label-${value.id}`;
            return (
                <TaskItem listKey={props.content.key} update={props.update} key={labelId} task={value}
                          complete={props.complete} delete={props.delete}/>
            );
        })
    }

    return (
        <div>
            <Accordion square expanded={true}>
                <AccordionSummary
                    aria-controls={`${props.content.title}-task-content`}
                    id={`${props.content.title}-task-header`}
                >
                    <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                        {props.content.title.toUpperCase()}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List className={classes.list}>
                        {getTasks(props.content.tasks)}
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
