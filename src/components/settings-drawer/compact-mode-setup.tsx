import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Divider } from "@material-ui/core";
import ClearAllIcon from '@material-ui/icons/ClearAll';
import ClearAppData from "./clear-app-data";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import AppAccordion from "../common/app-accordian";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
    card: {
        minWidth: 275,
        width: '100%'
    },
    bullet: {
        display: 'inline-block',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 16,
    },
    pos: {
        marginBottom: 12,
    },
    posUp: {
        marginTop: 12,
    },
});

export default function CompactModeSetup() {
    const classes = useStyles();

    return (
        <AppAccordion id={'about-us'}
                      initialExpanded={true}
                      summary={
                          <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                              Compact Mode config
                          </Typography>
                      }
                      details={
                          <Card className={classes.card} variant="outlined">
                              <CardContent>
                                  <Typography className={classes.posUp} color="textSecondary">
                                      Widget One: <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      value={10}>
                                      <MenuItem value={10}>Ten</MenuItem>
                                      <MenuItem value={20}>Twenty</MenuItem>
                                      <MenuItem value={30}>Thirty</MenuItem>
                                  </Select>
                                  </Typography>
                              </CardContent>
                          </Card>}/>)
}
