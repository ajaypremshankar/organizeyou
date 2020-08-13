import { BaseTasksState } from "./base-tasks-state";
import { CompletedTask, SettingsType, Task } from "./types";
import { updateAppState } from "../utils/app-state-facade-utils";
import OverdueTaskList from "../components/task-lists-container/overdue-task-list";
import DayBasedTaskList from "../components/task-lists-container/day-based-task-list";
import CompletedTaskList from "../components/task-lists-container/completed-task-list";
import React from "react";

export class StateStore {
    private static baseState: BaseTasksState
    private static setBaseState: any

    public static initState = (state: BaseTasksState, setState: any) => {
        StateStore.baseState = state
        StateStore.setBaseState = setState;
    }

    public static getState = () => {
        return StateStore.baseState
    }

    public static setCurrentState = (state: BaseTasksState) => {
        StateStore.baseState = state
    }

    public static getTasksMap = (): Map<number, Task[]> => {
        return new Map<number, Task[]>(StateStore.baseState.tasks)
    }

    public static updateBaseState = (newState: BaseTasksState, persist: boolean = true) => {
        if (persist) {
            updateAppState(newState)
        }
        StateStore.setBaseState(newState)
        StateStore.setCurrentState(newState)
    }

    public static updateCurrentlySelectedDate = (date: number) => {
        StateStore.updateBaseState(new BaseTasksState(
            date,
            StateStore.baseState.tasks,
            StateStore.baseState.completedTasks,
            StateStore.baseState.settings,
            StateStore.baseState.fullMode), false)
    }

    public static handleTaskCompletion = (key: number, task: Task) => {
        StateStore.updateBaseState(StateStore.baseState.completeTask(key, task))
    }

    public static handleTaskAddition = (key: number, task: Task) => {
        StateStore.updateBaseState(StateStore.baseState.addTask(key, task))
    }

    public static handleTaskDeletion = (key: number, task: Task) => {
        StateStore.updateBaseState(StateStore.baseState.removeTask(key, task))
    }

    public static handleTaskMovement = (from: number, to: number, task: Task) => {
        StateStore.updateBaseState(StateStore.baseState.moveTask(from, to, task))
    }

    public static handleUndoComplete = (task: CompletedTask) => {
        StateStore.updateBaseState(StateStore.baseState.undoCompleteTask(task))
    }

    public static handleSettingsToggle = (type: SettingsType) => {
        StateStore.updateBaseState(StateStore.baseState.toggleSetting(type))
    }

    public static handleFullModeToggle = () => {
        StateStore.updateBaseState(StateStore.baseState.toggleFullMode())
    }

    public static handleShowAllToggle = () => {
        StateStore.updateBaseState(StateStore.baseState.toggleSetting(SettingsType.SHOW_ALL_TASKS), true)
    }

    public static getOverdueList = () => {
        const overdueTaskList = StateStore.baseState.getOverdueTasks()
        return overdueTaskList.isNotEmpty() ?
            <OverdueTaskList
                content={overdueTaskList}
                move={StateStore.handleTaskMovement}
                update={StateStore.handleTaskAddition}
                complete={StateStore.handleTaskCompletion} delete={StateStore.handleTaskDeletion}/>
            : null
    }

    public static getSelectedDateList = () => {

        return <DayBasedTaskList content={StateStore.baseState.getTargetTasks()}
                                 update={StateStore.handleTaskAddition}
                                 move={StateStore.handleTaskMovement}
                                 complete={StateStore.handleTaskCompletion}
                                 delete={StateStore.handleTaskDeletion}
                                 showAll={StateStore.baseState.isShowAllTasks()}
                                 expanded={true}/>
    }

    public static getCompletedList = () => {
        const completedTaskList = StateStore.baseState.getCompletedTasks()
        return completedTaskList.isNotEmpty() ?
            <CompletedTaskList
                content={completedTaskList}
                undoComplete={StateStore.handleUndoComplete}/>
            : null
    }
}