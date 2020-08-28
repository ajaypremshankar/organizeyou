import { CompletedTask, HashTagTaskMapping, Task } from "../types/types";

export class HashTagUtils {

    private static regexp = /\B#\w\w+\b/g
    public static parseHashTags = (content: string): string[] => {
        return (content.match(HashTagUtils.regexp) || [])
            .map(function (s) {
                return s.trim().replace("#", "").toLowerCase()
            });
    }

    public static addHashTags = (newTask: Task, allTagsMap: Map<string, HashTagTaskMapping[]>)
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

    public static addOrUpdateHashTags = (currentTask: Task | null, updatedTask: Task | null,
                                    allTagsMap: Map<string, HashTagTaskMapping[]>)
        : Map<string, HashTagTaskMapping[]> => {

        const existingTags = currentTask ? currentTask.tags : []
        const newTags = updatedTask ? updatedTask.tags : []

        if (existingTags === newTags) return new Map<string, HashTagTaskMapping[]>()

        return new Map([
            ...(currentTask ? Array.from(HashTagUtils.deleteHashTags(currentTask, allTagsMap).entries()) : []),
            ...(updatedTask ? Array.from(HashTagUtils.addHashTags(updatedTask, allTagsMap).entries()) : []),
        ])
    }

    public static moveHashTags = (movedTask: Task, allTagsMap: Map<string, HashTagTaskMapping[]>)
        : Map<string, HashTagTaskMapping[]> => {

        const existingTags = movedTask ? movedTask.tags : []

        const tagTaskMap: Map<string, HashTagTaskMapping[]> = new Map<string, HashTagTaskMapping[]>();

        (existingTags || []).forEach(existingTag => {
            const tagTaskArr: HashTagTaskMapping[] = allTagsMap.get(existingTag) || []

            tagTaskMap.set(existingTag, tagTaskArr.map(value => {
                return {
                    ...value,
                    plannedOn: movedTask.plannedOn,
                }
            }))
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
                return {
                    ...value,
                    completed: completedTask.id === value.taskId ? true : value.completed,
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
                return {
                    ...value,
                    completed: undoCompletedTask.id === value.taskId ? false : value.completed,
                }
            }))
        })

        return tagTaskMap
    }
}