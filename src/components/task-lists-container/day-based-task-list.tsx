import React , {useState}from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import {Task} from "../../types/types";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TaskItem from "../task-item/task-item";

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


const Accordion = withStyles({
    root: {
        border: '0px solid rgba(0, 0, 0, .125)',
        marginBottom:'20px',
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

interface DateTasks {
    title: string;
    tasks: Task[]
    update: (task: Task) => void
    complete: (task: Task) => void
    expanded?:boolean
}

export default function DayBasedTaskList(props: DateTasks) {

    const classes = useStyles();

    const [expanded, setExpanded] = useState(props.expanded)

    const handleChange =  () => {
        setExpanded(!expanded)
    };

    return (
        <div>
            <Accordion square expanded={expanded} onChange={handleChange}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
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
                            <TaskItem update={props.update} key={labelId} task={value} complete={props.complete} />
                        );
                    })}
                </List>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
