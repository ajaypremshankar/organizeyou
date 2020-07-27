import React, {useState} from 'react';
import {createStyles, makeStyles, Theme, withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import {Task} from "../../types/types";
import TaskItem from "./task-item/task-item";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";

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
    title: string;
    tasks: Task[]
    update: (task: Task) => void
    complete: (task: Task) => void
    expanded?: boolean
}


export default function DayBasedTaskList(props: DateTasks) {

    const classes = useStyles();

    const getTasks = () => {

        if (!props.tasks || props.tasks.length == 0) {
            return Array.of(<ListItem
                key={'no-items-in-list'}
                role={undefined} dense>

                <ListItemText
                    className={classes.itemText}
                    id={'no-item'}
                    primary={'Nothing awaits you here :) '}
                />
            </ListItem>)
        }

        return props.tasks.map((value, index) => {
            const labelId = `checkbox-list-label-${index}`;

            return (
                <TaskItem update={props.update} key={labelId} task={value} complete={props.complete}/>
            );
        })
    }

    return (
        <div>
            <Accordion square expanded={true}>
                <AccordionSummary
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                        {props.title.toUpperCase()}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List className={classes.list}>
                        {getTasks()}
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
