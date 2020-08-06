import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Divider } from "@material-ui/core";
import ClearAllIcon from '@material-ui/icons/ClearAll';
import ClearAppData from "./clear-app-data";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
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
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <Typography className={classes.title} color="textPrimary" gutterBottom>
                    About Us
                </Typography>
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
                <Typography className={classes.posUp} variant="body1">
                    <Link target={'_blank'} color={'secondary'} href={`https://forms.gle/4eEfLWPqLWQCwkjA8`}>
                        Report a bug
                    </Link>
                </Typography>
                <Typography className={classes.posUp} variant="subtitle2">
                    <Link target={'_blank'} color={'primary'} href={`https://forms.gle/dv3P8KpzvvWfA5ur6`}>
                        Request a feature
                    </Link>
                </Typography>
                <Divider/>
                <Typography className={classes.posUp} color="textSecondary">
                    Version:
                </Typography>
                <Typography className={classes.posUp} variant="subtitle1">
                    2.3.1
                </Typography>
                <Divider/>
                <Typography className={classes.posUp} variant="subtitle2">
                    Having trouble using app? <br/>
                    <ClearAppData />
                </Typography>
            </CardContent>
        </Card>
    );
}
