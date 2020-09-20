import { HashTagUtils } from "./hash-tags/hash-tag-utils";
import { TaskTemplateStateService } from "./task-template/task-template-state-service";
import { TasksState } from "./tasks/tasks-state";
import { AppStateService } from "./tasks/app-state-service";
import { CompletedTask, Task, TASK_FREQUENCY_TYPE } from "../types/types";
import { getCurrentMillis } from "../utils/date-utils";
import { DateAndFrequency } from "../components/widgets/add-task/add-task-widget";

export class AppStateFacade {

    public static addTask = (taskFrequency: TASK_FREQUENCY_TYPE,
                             plannedOn: number,
                             value: string) => {

        const now = getCurrentMillis()
        const tags = HashTagUtils.parseHashTags(value)

        let taskTemplateId = undefined
        if (taskFrequency !== TASK_FREQUENCY_TYPE.NO_REPEAT) {
            TaskTemplateStateService.handleTemplateAdditionOrUpdation({
                id: now,
                currentlyActiveTaskId: now,
                nextPlannedOn: TaskTemplateStateService.getNextPlannedOn(plannedOn, taskFrequency)!,
                taskFrequency: taskFrequency,
                currentlyActiveTaskPlannedOn: plannedOn,
            })

            taskTemplateId = now
        }

        const newTask = {
            id: now,
            plannedOn: plannedOn,
            value: value,
            updatedOn: now,
            tags: tags,
            taskTemplateId: taskTemplateId
        }

        AppStateService.handleTaskAdditionOrUpdation(null, newTask)
        AppStateService.updateHashTagState(
            HashTagUtils.addOrUpdateHashTags(null, newTask, AppStateService.getHashTags())
        );
    }

    public static updateTask = (currentTask: Task, newValue: string) => {

        const tags = HashTagUtils.parseHashTags(newValue)
        const updatedTask = {
            ...currentTask,
            value: newValue,
            updatedOn: getCurrentMillis(),
            tags: tags,
        }

        AppStateService.handleTaskAdditionOrUpdation(currentTask, updatedTask)
        AppStateService.updateHashTagState(
            HashTagUtils.addOrUpdateHashTags(currentTask, updatedTask, AppStateService.getHashTags())
        );
    }

    public static moveTask = (currentTask: Task, dateAndFrequency: DateAndFrequency, moveSeries: boolean = false) => {

        const now = getCurrentMillis()
        //Template
        let taskTemplateId = currentTask.taskTemplateId
        const currentFrequency = taskTemplateId ? TaskTemplateStateService.getFrequencyById(taskTemplateId) : TASK_FREQUENCY_TYPE.NO_REPEAT
        if (moveSeries
            && dateAndFrequency.frequency !== TASK_FREQUENCY_TYPE.NO_REPEAT
            && dateAndFrequency.frequency !== currentFrequency) {
            TaskTemplateStateService.handleTemplateAdditionOrUpdation({
                id: now,
                currentlyActiveTaskId: currentTask.id,
                nextPlannedOn: TaskTemplateStateService.getNextPlannedOn(dateAndFrequency.date, dateAndFrequency.frequency)!,
                taskFrequency: dateAndFrequency.frequency,
                currentlyActiveTaskPlannedOn: dateAndFrequency.date,
            })

            taskTemplateId = now
        } else if (moveSeries && dateAndFrequency.frequency === TASK_FREQUENCY_TYPE.NO_REPEAT) {
            taskTemplateId = undefined
        } else if (!moveSeries && taskTemplateId) {
            TaskTemplateStateService.updateTemplateForMovedTask(taskTemplateId, dateAndFrequency.date)
        }

        //Task
        const from = currentTask.plannedOn
        const updatedTask = {
            ...currentTask,
            plannedOn: dateAndFrequency.date,
            updatedOn: now,
            taskTemplateId: taskTemplateId
        }

        AppStateService.handleTaskMovement(from, updatedTask)

        //Hashtag
        AppStateService.updateHashTagState(HashTagUtils.moveHashTags(updatedTask, AppStateService.getHashTags()));
    }

    public static deleteTask = (task: Task, deleteSeries: boolean = false) => {
        //Task
        AppStateService.handleTaskDeletion(task)

        //Hashtag
        AppStateService.updateHashTagState(HashTagUtils.deleteHashTags(task, AppStateService.getHashTags()));

        //Template
        if (deleteSeries && task.taskTemplateId) {
            TaskTemplateStateService.deleteTemplate(task.taskTemplateId);
        } else if (!deleteSeries && task.taskTemplateId) {
            setTimeout(() => {
                const nextTask = TaskTemplateStateService.getNextTask(task)

                if (nextTask && nextTask.taskTemplateId) {
                    AppStateService.handleTaskAdditionOrUpdation(null, nextTask)

                    AppStateService.updateHashTagState(HashTagUtils.addOrUpdateHashTags(null, nextTask, AppStateService.getHashTags()));

                    TaskTemplateStateService.updateTemplateByTask(nextTask)
                }
            }, 500)
        }
    }

    public static completeTask = (currentTask: Task) => {

        const updatedTask: CompletedTask = {
            ...currentTask,
            updatedOn: getCurrentMillis(),
            completedDate: getCurrentMillis()
        }
        //Task
        AppStateService.handleTaskCompletion(updatedTask)

        //Hashtag
        AppStateService.updateHashTagState(HashTagUtils.completeHashTags(updatedTask, AppStateService.getHashTags()));

        // Template

        if (currentTask.taskTemplateId) {
            // Since Browser sync is asynchronous, let it complete
            setTimeout(() => {
                const nextTask = TaskTemplateStateService.getNextTask(TasksState.toTask(updatedTask))

                if (nextTask) {
                    AppStateService.handleTaskAdditionOrUpdation(null, nextTask)

                    AppStateService.updateHashTagState(HashTagUtils.addOrUpdateHashTags(null, nextTask, AppStateService.getHashTags()));

                    TaskTemplateStateService.updateTemplateByTask(nextTask)
                }
            }, 500)
        }
    }


    public static undoCompleteTask = (currentTask: CompletedTask) => {

        const updatedTask = TasksState.toTask(currentTask)

        //Task
        AppStateService.handleUndoComplete(updatedTask)

        //Hashtag
        AppStateService.updateHashTagState(HashTagUtils.undoCompleteHashTags(updatedTask, AppStateService.getHashTags()));

        //Template

        if (updatedTask.taskTemplateId) {
            const taskTemplate = TaskTemplateStateService.getById(updatedTask.taskTemplateId)

            if (taskTemplate) {
                setTimeout(() => {
                    const activeTask = AppStateService.getTaskBy(taskTemplate.currentlyActiveTaskPlannedOn, taskTemplate.currentlyActiveTaskId)

                    if (activeTask) {
                        AppStateService.handleTaskDeletion(activeTask)

                        AppStateService.updateHashTagState(HashTagUtils.deleteHashTags(activeTask, AppStateService.getHashTags()));

                        AppStateService.updateHashTagState(HashTagUtils.deleteHashTags(activeTask, AppStateService.getHashTags()));
                    }
                }, 500)
            }

            TaskTemplateStateService.updateTemplateByTask(updatedTask)
        }
    }

    public static deleteCompletedTask = (task: CompletedTask, deleteSeries: boolean = false) => {
        //Task
        AppStateService.handleCompletedTaskDeletion(task)

        //Hashtag
        AppStateService.updateHashTagState(HashTagUtils.deleteHashTags(task, AppStateService.getHashTags()));

        //Template
        if (deleteSeries && task.taskTemplateId) {
            TaskTemplateStateService.deleteTemplate(task.taskTemplateId)
        }
    }
}