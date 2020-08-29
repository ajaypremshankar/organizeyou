import { CompletedTask, HashTagTaskMapping, Task } from "../../types/types";
import { arrayEquals } from "../../utils/object-utils";

export class HashTagUtils {

    private static regexp = /\B#\w+\b/g

    /***
     * Not checking if task entry in a tag exists or NOT
     * @param newTask
     * @param allTagsMap
     */
    private static addHashTags = (newTask: Task, allTagsMap: Map<string, HashTagTaskMapping[]>)
        : Map<string, HashTagTaskMapping[]> => {

        const newTags = newTask ? newTask.tags : []
        const tagTaskMap: Map<string, HashTagTaskMapping[]> = new Map<string, HashTagTaskMapping[]>();

        (newTags || []).forEach(tag => {
            const tagTaskArr: HashTagTaskMapping[] = allTagsMap.get(tag) || []
            tagTaskArr.push({
                value: tag,
                plannedOn: newTask.plannedOn,
                taskId: newTask.id,
                completed: false
            })

            tagTaskMap.set(tag, tagTaskArr)
        })

        return tagTaskMap
    }

    public static parseHashTags = (content: string): string[] => {
        return (content.match(HashTagUtils.regexp) || [])
            .map(function (s) {
                return s.trim().replace("#", "").toLowerCase()
            });
    }

    public static addOrUpdateHashTags = (currentTask: Task | null, updatedTask: Task | null,
                                         allTagsMap: Map<string, HashTagTaskMapping[]>)
        : Map<string, HashTagTaskMapping[]> => {

        const existingTags = currentTask ? currentTask.tags : []
        const newTags = updatedTask ? updatedTask.tags : []

        if (arrayEquals(existingTags, newTags)) return new Map<string, HashTagTaskMapping[]>()

        return new Map([
            ...(currentTask ? Array.from(HashTagUtils.deleteHashTags(currentTask, allTagsMap).entries()) : []),
            ...(updatedTask ? Array.from(HashTagUtils.addHashTags(updatedTask, allTagsMap).entries()) : []),
        ])
    }

    public static deleteHashTags = (targetTask: Task | CompletedTask, allTagsMap: Map<string, HashTagTaskMapping[]>)
        : Map<string, HashTagTaskMapping[]> => {

        const existingTags = targetTask ? targetTask.tags : []

        const tagTaskMap: Map<string, HashTagTaskMapping[]> = new Map<string, HashTagTaskMapping[]>();

        (existingTags || []).forEach(existingTag => {
            const tagTaskArr: HashTagTaskMapping[] = allTagsMap.get(existingTag) || []
            tagTaskMap.set(existingTag, tagTaskArr.filter(x => x.taskId !== targetTask.id))
        })

        return tagTaskMap
    }

    public static moveHashTags = (movedTask: Task, allTagsMap: Map<string, HashTagTaskMapping[]>)
        : Map<string, HashTagTaskMapping[]> => {

        const existingTags = movedTask ? movedTask.tags : []

        const tagTaskMap: Map<string, HashTagTaskMapping[]> = new Map<string, HashTagTaskMapping[]>();

        (existingTags || []).forEach(existingTag => {
            //Get HashTagTaskMap which will have other tags too.
            const tagTaskArr: HashTagTaskMapping[] = allTagsMap.get(existingTag) || []
            const movedTagsToNewPlannedDate = tagTaskArr.map(value => {
                if (value.taskId === movedTask.id) {
                    return {
                        ...value,
                        plannedOn: movedTask.plannedOn,
                    }
                } else {
                    return value
                }
            })

            tagTaskMap.set(existingTag, movedTagsToNewPlannedDate)
        })

        return tagTaskMap
    }

    public static completeHashTags = (completedTask: CompletedTask, allTagsMap: Map<string, HashTagTaskMapping[]>)
        : Map<string, HashTagTaskMapping[]> => {

        const existingTags = completedTask ? completedTask.tags : []

        const tagTaskMap: Map<string, HashTagTaskMapping[]> = new Map<string, HashTagTaskMapping[]>();

        (existingTags || []).forEach(existingTag => {
            const tagTaskArr: HashTagTaskMapping[] = allTagsMap.get(existingTag) || []

            tagTaskMap.set(existingTag, tagTaskArr.map(value => {

                if (value.taskId === completedTask.id) {
                    return {
                        ...value,
                        completed: true,
                    }
                } else {
                    return value
                }
            }))
        })

        return tagTaskMap
    }

    public static undoCompleteHashTags = (undoCompletedTask: Task, allTagsMap: Map<string, HashTagTaskMapping[]>)
        : Map<string, HashTagTaskMapping[]> => {

        const existingTags = undoCompletedTask ? undoCompletedTask.tags : []

        const tagTaskMap: Map<string, HashTagTaskMapping[]> = new Map<string, HashTagTaskMapping[]>();

        (existingTags || []).forEach(existingTag => {
            const tagTaskArr: HashTagTaskMapping[] = allTagsMap.get(existingTag) || []

            tagTaskMap.set(existingTag, tagTaskArr.map(value => {
                if (value.taskId === undoCompletedTask.id) {
                    return {
                        ...value,
                        completed: false,
                    }
                } else {
                    return value
                }
            }))
        })

        return tagTaskMap
    }
}