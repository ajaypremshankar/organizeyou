import { CompletedTask, ListType, Task } from "../types/types";
import { BaseTasksState } from "../types/base-tasks-state";

export const migrateOverdueListToDateList = (tasks: Map<number, Task[] | CompletedTask[]>)
    : Map<number, Task[] | CompletedTask[]> => {

    if (!tasks.get(ListType.OVERDUE)) return tasks

    const newTasks = new Map<number, Task[] | CompletedTask[]>(tasks)
    newTasks.delete(ListType.OVERDUE)

    const overdueTasks = tasks.get(ListType.OVERDUE) || []

    overdueTasks.forEach(value => {
        newTasks.set(value.plannedOn, [...newTasks.get(value.plannedOn) || [], value])
    })

    return newTasks
}

export const migrateCompletedListFromMap = (baseState: BaseTasksState)
    : BaseTasksState => {

    if (!baseState.tasks.get(ListType.COMPLETED)) return baseState

    const newTasks = new Map<number, Task[] | CompletedTask[]>(baseState.tasks)
    const completedTasks = [...baseState.tasks.get(ListType.COMPLETED) || []] as CompletedTask[]
    newTasks.delete(ListType.COMPLETED)


    return new BaseTasksState(
        baseState.selectedDate,
        newTasks,
        completedTasks,
        baseState.settings
    )
}