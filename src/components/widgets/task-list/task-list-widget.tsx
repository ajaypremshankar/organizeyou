import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { StateStore } from "../../../types/state-store";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: '100%',
            margin: 'auto',
            backgroundColor: theme.palette.background.paper,
        },
        fullWidth: {
            width: '100%'
        }
    }),
);

interface TaskListWidgetProps {
    showCompleted?: boolean
}

export default function TaskListWidget(props: TaskListWidgetProps) {

    const classes = useStyles();

    return (
        <div className={classes.fullWidth}>
            <div style={{
                textAlign: 'right',
                marginBottom: '5px',
            }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={StateStore.getState().isShowAllTasks()}
                            onChange={StateStore.handleShowAllToggle}
                            name="checkedB"
                            color="primary"
                            edge={'start'}
                            size="small"
                        />
                    }
                    label="Show all tasks"
                />
            </div>
            {!StateStore.getState().isShowAllTasks() && StateStore.getOverdueList()}
            {StateStore.getSelectedDateList()}
            {props.showCompleted && StateStore.getCompletedList()}
        </div>
    );
}
