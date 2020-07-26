import React, {useState} from 'react';
import {createStyles, makeStyles, Theme, fade} from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import Fade from '@material-ui/core/Fade';
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
    tasks: CompletedTask[]
}

export default function CompletedTaskList(props: DateTasks) {

    const classes = useStyles();
    const [expanded, setExpanded] = useState(false)

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
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
