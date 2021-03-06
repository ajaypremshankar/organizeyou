import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Divider } from "@material-ui/core";
import ClearAppData from "./clear-app-data";
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

    function getDetails() {
        return <Card className={classes.card} variant="outlined">
            <CardContent>
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
        </Card>;
    }

    function getSummary() {
        return <Typography variant="subtitle1" gutterBottom className={classes.title} color="primary">
            v{process.env.REACT_APP_VERSION}
        </Typography>;
    }

    return (
        <AppAccordion
            id={'about-us'}
            initialExpanded={false}
            summary={getSummary()}
            details={getDetails()}
        />
    )
}
