import React, { useEffect, useState } from 'react';
import { CompletedTask, SettingsType, Task } from "../../types/types";
import { createStyles, makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import AddTaskContainer from "../add-task/add-task-container";
import OverdueTaskList from "../task-lists-container/overdue-task-list";
import DayBasedTaskList from "../task-lists-container/day-based-task-list";
import CompletedTaskList from "../task-lists-container/completed-task-list";
import { BaseTasksState } from "../../types/base-tasks-state";
import SettingsDrawer from "../settings-drawer/settings-drawer";
import Clock from '../clock/clock';
import { getClockOptions } from "../../utils/settings-utils";
import { emptyState, loadAppState, updateAppState } from "../../utils/app-state-facade-utils";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import Paper from '@material-ui/core/Paper';
import { StateStore } from "../../types/state-store";
import NavigationLinks from "../links/browser-navigate-links";
import { isFirefox } from "react-device-detect";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: 'auto',
            maxWidth: '700px',
            alignItems: 'center',
            '& > *': {
                margin: theme.spacing(2),
            },
        },
        fullWidth: {
            width: '100%'
        }
    }),
);

export default function BaseApp() {
    const classes = useStyles();

    const [baseState, setBaseState] = useState(
        emptyState()
    )

    StateStore.setCurrentState(baseState)

    useEffect(() => {
        loadAppState().then(value => {
            setBaseState(value)
            StateStore.setCurrentState(value)
        })
    }, [])

    useEffect(() => {
        const pendingTasksCount = baseState.pendingTasksCount()
        document.title = `(${pendingTasksCount}) ${pendingTasksCount === 1 ? 'task' : 'tasks'} pending`
    }, [baseState.tasks])

    const updateBaseState = (newState: BaseTasksState, persist: boolean = true) => {
        if (persist) {
            updateAppState(newState)
        }
        setBaseState(newState)
        StateStore.setCurrentState(newState)
    }

    const updateCurrentlySelectedDate = (date: number) => {
        updateBaseState(new BaseTasksState(date, baseState.tasks, baseState.completedTasks, baseState.settings), false)
    }

    const handleTaskCompletion = (key: number, task: Task) => {
        updateBaseState(baseState.completeTask(key, task))
    }

    const handleTaskAddition = (key: number, task: Task) => {
        updateBaseState(baseState.addTask(key, task))
    }

    const handleTaskDeletion = (key: number, task: Task) => {
        updateBaseState(baseState.removeTask(key, task))
    }

    const handleTaskMovement = (from: number, to: number, task: Task) => {
        updateBaseState(baseState.moveTask(from, to, task))
    }

    const handleUndoComplete = (task: CompletedTask) => {
        updateBaseState(baseState.undoCompleteTask(task))
    }

    const handleSettingsToggle = (type: SettingsType) => {
        updateBaseState(baseState.toggleSetting(type))
    }

    const handleShowAllToggle = () => {
        updateBaseState(baseState.toggleSetting(SettingsType.SHOW_ALL_TASKS), true)
    }

    const getOverdueList = () => {
        const overdueTaskList = baseState.getOverdueTasks()
        return overdueTaskList.isNotEmpty() ?
            <OverdueTaskList
                content={overdueTaskList}
                move={handleTaskMovement}
                update={handleTaskAddition}
                complete={handleTaskCompletion} delete={handleTaskDeletion}/>
            : null
    }

    const getSelectedDateList = () => {

        return <DayBasedTaskList content={baseState.getTargetTasks()}
                                 update={handleTaskAddition}
                                 move={handleTaskMovement}
                                 complete={handleTaskCompletion}
                                 delete={handleTaskDeletion}
                                 showAll={baseState.isShowAllTasks()}
                                 expanded={true}/>
    }

    const getCompletedList = () => {
        const completedTaskList = baseState.getCompletedTasks()
        return completedTaskList.isNotEmpty() ?
            <CompletedTaskList
                content={completedTaskList}
                undoComplete={handleUndoComplete}/>
            : null
    }

    const theme = createMuiTheme({
        palette: {
            type: baseState.settings.get(SettingsType.DARK_THEME) ? 'dark' : 'light',
            primary: {
                main: baseState.settings.get(SettingsType.DARK_THEME) ? '#FFFF' : '#1976d2',
            },
            /*background: {
                paper:
            }*/
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Paper style={{
                width: '100%',
                minHeight: '100%',
                position: 'absolute',
            }}>
                <div className={classes.root}>
                    {!isFirefox && <NavigationLinks/>}
                    <Clock options={getClockOptions(baseState.settings)}></Clock>
                    <AddTaskContainer
                        keyTitle={baseState.getKeyTitle()}
                        changeSelectedDate={updateCurrentlySelectedDate}
                        addTask={handleTaskAddition}/>
                    <SettingsDrawer
                        handleSettingsToggle={handleSettingsToggle}
                        settings={baseState.settings}/>
                    <div className={classes.fullWidth}>
                        <div style={{
                            textAlign: 'right',
                            marginBottom: '5px',
                        }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={baseState.isShowAllTasks()}
                                        onChange={handleShowAllToggle}
                                        name="checkedB"
                                        color="primary"
                                        edge={'start'}
                                        size="small"
                                    />
                                }
                                label="Show all tasks"
                            />
                        </div>
                        {!baseState.isShowAllTasks() && getOverdueList()}
                        {getSelectedDateList()}
                        {getCompletedList()}
                    </div>
                </div>
            </Paper>
        </ThemeProvider>
    )
}

