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

export default function AboutUs() {
    const classes = useStyles();

    return (
        <AppAccordion id={'about-us'}
                      initialExpanded={false}
                      summary={
                          <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
                              v{process.env.REACT_APP_VERSION}
                          </Typography>
                      }
                      details={
                          <Card className={classes.card} variant="outlined">
                              <CardContent>
                                  <Typography className={classes.posUp} color="textSecondary">
                                      Created by
                                  </Typography>
                                  <Typography variant="subtitle1" component="h6">
                                      <Link target={'_blank'} href="https://www.linkedin.com/in/ajaypremshankar/">
                                          Ajay Prem Shankar
                                      </Link>
                                  </Typography>
                                  <Divider/>
                                  <Typography className={classes.posUp} color="textSecondary">
                                      Special thanks to
                                  </Typography>
                                  <Typography variant="subtitle1" component="h6">
                                      <Link target={'_blank'} href="https://www.linkedin.com/in/spratap124/">
                                          Surya Pratap
                                      </Link>
                                  </Typography>
                                  <Divider/>
                                  <Typography className={classes.posUp} variant="subtitle2">
                                      <Link target={'_blank'} color={'secondary'}
                                            href={`https://forms.gle/4eEfLWPqLWQCwkjA8`}>
                                          Report a bug
                                      </Link>
                                  </Typography>
                                  <Typography className={classes.posUp} variant="subtitle2">
                                      <Link target={'_blank'} color={'primary'}
                                            href={`https://forms.gle/dv3P8KpzvvWfA5ur6`}>
                                          Request a feature
                                      </Link>
                                  </Typography>
                                  <Divider/>
                                  <Typography className={classes.posUp} variant="subtitle2">
                                      Having trouble using app? <br/>
                                      <ClearAppData/>
                                  </Typography>
                              </CardContent>
                          </Card>}/>)
}
