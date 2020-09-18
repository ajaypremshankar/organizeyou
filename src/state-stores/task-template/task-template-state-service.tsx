import { Task, TASK_FREQUENCY_TYPE, TaskTemplate } from "../../types/types";
import { TaskTemplateState } from "./task-template-state";
import { TASK_TEMPLATE_STATE_ACTION, TaskTemplateStateRepository } from "./task-template-state-repository";
import {
    getCurrentMillis,
    getNextDayKey,
    getNextMonthKey,
    getNextWeekdayKey,
    getNextWeekKey,
    getNextYearKey
} from "../../utils/date-utils";


export class TaskTemplateStateService {
    private static state: TaskTemplateState
    private static setState: any

    public static initStore = (state: TaskTemplateState, setState: any) => {
        TaskTemplateStateService.state = state
        TaskTemplateStateService.setState = setState;
    }

    static setToStore = (state: TaskTemplateState) => {
        TaskTemplateStateService.setState(state)
        TaskTemplateStateService.state = state
    }

    public static loadState = () => {
        TaskTemplateStateRepository.loadAppState().then(value => {
            TaskTemplateStateService.setState(value)
        })
    }

    private static updateState = (action: TASK_TEMPLATE_STATE_ACTION,
                                  data: TaskTemplate, newState: TaskTemplateState,
                                  persist: boolean = true) => {
        if (persist) {
            TaskTemplateStateRepository.update(action, data)
        }
        TaskTemplateStateService.setToStore(newState)
    }

    // GETTERS - START --------------------------------------------

    public static getById = (id: number): TaskTemplate | undefined => {
        return TaskTemplateStateService.state.templates.get(id)
    }

    public static getFrequencyById = (id: number): TASK_FREQUENCY_TYPE => {
        let taskTemplate = TaskTemplateStateService.state.templates.get(id);
        return taskTemplate ? taskTemplate.taskFrequency : TASK_FREQUENCY_TYPE.NO_REPEAT
    }

    public static getNextTask = (task: Task): Task | undefined => {
        if (task && task.taskTemplateId) {

            const taskFrequency = TaskTemplateStateService.getById(task.taskTemplateId)
            if (taskFrequency) {
                const now = getCurrentMillis()
                const newPlannedOn = TaskTemplateStateService.getNextPlannedOn(task.plannedOn, taskFrequency.taskFrequency)
                if (newPlannedOn) {
                    return {
                        ...task,
                        id: now,
                        plannedOn: newPlannedOn,
                    }
                }
            }
        }
    }

    public static getNextPlannedOn = (plannedOn: number, taskFrequency: TASK_FREQUENCY_TYPE): number | undefined => {

        switch (taskFrequency) {
            case TASK_FREQUENCY_TYPE.DAILY:
                return getNextDayKey(plannedOn)
            case TASK_FREQUENCY_TYPE.WEEKDAYS:
                return getNextWeekdayKey(plannedOn)
            case TASK_FREQUENCY_TYPE.WEEKLY:
                return getNextWeekKey(plannedOn)
            case TASK_FREQUENCY_TYPE.MONTHLY:
                return getNextMonthKey(plannedOn)
            case TASK_FREQUENCY_TYPE.YEARLY:
                return getNextYearKey(plannedOn)
        }

    }

    // GETTERS - END --------------------------------------------

    // SETTERS - START ------------------------------------------


    public static handleTemplateAdditionOrUpdation = (data: TaskTemplate) => {
        TaskTemplateStateService.updateState(
            TASK_TEMPLATE_STATE_ACTION.ADD_UPDATE, data,
            TaskTemplateStateService.state.addOrUpdateTemplate(data))
    }

    public static deleteTemplate(taskTemplateId: number) {
        const data = TaskTemplateStateService.getById(taskTemplateId)

        if (data) {
            TaskTemplateStateService.updateState(
                TASK_TEMPLATE_STATE_ACTION.DELETE, data,
                TaskTemplateStateService.state.deleteTemplate(taskTemplateId))
        }
    }

    public static updateTemplateByTask = (task: Task) => {
        const taskTemplate = TaskTemplateStateService.getById(task.taskTemplateId!)
        if (taskTemplate) {
            const nextPlannedOn = TaskTemplateStateService.getNextPlannedOn(task.plannedOn, taskTemplate?.taskFrequency)
            if (nextPlannedOn) {
                TaskTemplateStateService.handleTemplateAdditionOrUpdation({
                    ...taskTemplate,
                    currentlyActiveTaskId: task.id,
                    nextPlannedOn: nextPlannedOn,
                    currentlyActiveTaskPlannedOn: task.plannedOn
                })
            }
        }
    }

    // SETTERS - END --------------------------------------------

}