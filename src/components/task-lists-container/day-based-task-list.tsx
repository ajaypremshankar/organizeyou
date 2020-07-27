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
        minHeight: 20,
        '&$expanded': {
            minHeight: 20,
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
    root: {
    },
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

    const [expandedState, setExpandedState] = useState(props.expanded)

    const handleChange = () => {
        setExpandedState(!expandedState)
    };

    return (
        <div>
            <Accordion square expanded={expandedState} onChange={handleChange}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                        {props.title.toUpperCase()}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List className={classes.list}>
                        {props.tasks.map((value, index) => {
                            const labelId = `checkbox-list-label-${index}`;

                            return (
                                <TaskItem update={props.update} key={labelId} task={value} complete={props.complete}/>
                            );
                        })}
                    </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
