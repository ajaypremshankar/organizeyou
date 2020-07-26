import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import {getDayAfterTomorrow, getToday, getTomorrow} from "../../utils/date-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidht: {
            width: '100%'
        }
    }),
);


export default function TopButtonGroup(props: any) {
    const classes = useStyles()
    return (
        <Fade in={true}>
            <div className={classes.fullWidht}>
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
                        onClick={() => props.showAddTask(getDayAfterTomorrow())}>Date</Button>
                </ButtonGroup>
            </div>
        </Fade>
    );
}
