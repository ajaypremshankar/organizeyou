import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {format} from "date-fns";
import Fade from '@material-ui/core/Fade';
import {getToday, getTomorrow} from "../../utils/date-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: 'auto',
            maxWidth: 600,
            alignItems: 'center',
            '& > *': {
                margin: theme.spacing(4),
            },
        },
    }),
);


export default function TopButtonGroup(props: any) {
    const classes = useStyles();
    return (
        <Fade in={true}>
            <div className={classes.root}>
                <ButtonGroup
                    size="large"
                    color="primary"
                    aria-label="large outlined primary button group"
                    fullWidth={true}>
                    <Button
                        onClick={() => props.showAddTask(getToday())}>Today</Button>
                    <Button
                        onClick={() => props.showAddTask(getTomorrow())}>Tomorrow</Button>
                    <Button
                        onClick={() => props.showAddTask(format(new Date(), "yyyy-MM-dd'T'hh:mm"))}>Someday</Button>
                </ButtonGroup>
            </div>
        </Fade>
    );
}
