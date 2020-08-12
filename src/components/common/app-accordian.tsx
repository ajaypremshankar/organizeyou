import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';

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

interface AppAccordionProps {
    id: string
    initialExpanded: boolean
    summary: JSX.Element
    details: JSX.Element
}

export default function AppAccordion(props: AppAccordionProps) {
    const [expanded, setExpanded] = useState(props.initialExpanded)

    return (
        <Accordion square expanded={expanded} onChange={() => setExpanded(!expanded)} id={`${props.id}-accordion`}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`${props.id}-content`}
                id={`${props.id}-header`}>
                {props.summary}
            </AccordionSummary>
            <AccordionDetails>
                {props.details}
            </AccordionDetails>
        </Accordion>
    );
}
