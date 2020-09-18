import { CompletedTask, HashTagTaskMapping, Task } from "../../types/types";
import { HashTagUtils } from "./hash-tag-utils";

describe("HashTagUtils: addOrUpdateHashTags", () => {
    it("when task is new, should add to map", () => {
        const activeTask: Task = {
            id: 1234567,
            value: "Task value",
            plannedOn: 20200828,
            updatedOn: 987654,
            tags: ['tag1', 'tag2']
        }

        const deltaMap: Map<string, HashTagTaskMapping[]> = HashTagUtils.addOrUpdateHashTags(
            null,
            activeTask,
            new Map<string, HashTagTaskMapping[]>([['tag1', [{
                value: 'tag1',
                plannedOn: 20200828,
                taskId: 9876543,
                completed: false
            }]]]))

        expect(deltaMap).not.toBeNull()
        expect(deltaMap.size).toEqual(2)

        expect(deltaMap.get('tag1')).not.toBeNull()
        expect(deltaMap.get('tag1')?.length).toEqual(2)
        expect(deltaMap.get('tag1')).toContainEqual({
            value: 'tag1',
            plannedOn: activeTask.plannedOn,
            taskId: activeTask.id,
            completed: false
        })
        expect(deltaMap.get('tag1')).toContainEqual({
            value: 'tag1',
            plannedOn: 20200828,
            taskId: 9876543,
            completed: false
        })

        expect(deltaMap.get('tag2')).not.toBeNull()
        expect(deltaMap.get('tag2')?.length).toEqual(1)
        expect(deltaMap.get('tag2')).toEqual([{
            value: 'tag2',
            plannedOn: activeTask.plannedOn,
            taskId: activeTask.id,
            completed: false
        }])
    })

    it("when task is being updated, should update to map", () => {
        const currentTask: Task = {
            id: 1234567,
            value: "Task value",
            plannedOn: 20200828,
            updatedOn: 987654,
            tags: ['tag1', 'tag2']
        }

        const deltaMap: Map<string, HashTagTaskMapping[]> = HashTagUtils.addOrUpdateHashTags(
            currentTask,
            {
                ...currentTask,
                tags: ['tag2', 'tag3']
            },
            new Map<string, HashTagTaskMapping[]>([['tag3', [{
                value: 'tag3',
                plannedOn: 20200828,
                taskId: 9876543,
                completed: false
            }]], ['tag1', [{
                value: 'tag1',
                plannedOn: currentTask.plannedOn,
                taskId: currentTask.id,
                completed: false
            }]], ['tag2', [{
                value: 'tag2',
                plannedOn: currentTask.plannedOn,
                taskId: currentTask.id,
                completed: false
            }]]])
        )

        expect(deltaMap).not.toBeNull()
        expect(deltaMap.size).toEqual(2)

        expect(deltaMap.get('tag1')).not.toBeNull()
        expect(deltaMap.get('tag1')?.length).toEqual(0)

        expect(deltaMap.get('tag2')).toBeUndefined()

        expect(deltaMap.get('tag3')).not.toBeNull()
        expect(deltaMap.get('tag3')?.length).toEqual(2)
        expect(deltaMap.get('tag3')).toContainEqual({
            value: 'tag3',
            plannedOn: currentTask.plannedOn,
            taskId: currentTask.id,
            completed: false
        })
        expect(deltaMap.get('tag3')).toContainEqual({
            value: 'tag3',
            plannedOn: 20200828,
            taskId: 9876543,
            completed: false
        })
    })
})

describe("HashTagUtils: moveHashTags", () => {
    it("should change plannedOn for passed tag and task id", () => {
        const activeTask: Task = {
            id: 1234567,
            value: "Task value",
            plannedOn: 20200828,
            updatedOn: 987654,
            tags: ['tag1']
        }

        const deltaMap: Map<string, HashTagTaskMapping[]> = HashTagUtils.moveHashTags(
            {
                ...activeTask,
                plannedOn: 20200829
            },
            new Map<string, HashTagTaskMapping[]>([['tag1', [{
                value: 'tag1',
                plannedOn: 20200828,
                taskId: 1234567,
                completed: false
            }, {
                value: 'tag1',
                plannedOn: 20200901,
                taskId: 12121212,
                completed: false
            }]], ['tag2', [{
                value: 'tag2',
                plannedOn: 20200829,
                taskId: 8754321,
                completed: false
            }]]]))

        expect(deltaMap).not.toBeNull()
        expect(deltaMap.size).toEqual(1)

        expect(deltaMap.get('tag1')).not.toBeNull()
        expect(deltaMap.get('tag1')?.length).toEqual(2)
        expect(deltaMap.get('tag1')).toContainEqual({
            value: 'tag1',
            plannedOn: 20200829,
            taskId: activeTask.id,
            completed: false
        })

        expect(deltaMap.get('tag1')).toContainEqual({
            value: 'tag1',
            plannedOn: 20200901,
            taskId: 12121212,
            completed: false
        })

        expect(deltaMap.get('tag2')).toBeUndefined()
    })
})

describe("HashTagUtils: completeHashTags", () => {
    it("should change completed to true for passed tag and task id", () => {
        const completedTask: CompletedTask = {
            id: 1234567,
            value: "Task value",
            plannedOn: 20200828,
            updatedOn: 987654,
            completedDate: 1212121212,
            tags: ['tag1', 'tag2']
        }

        const deltaMap: Map<string, HashTagTaskMapping[]> = HashTagUtils.completeHashTags(
            completedTask,
            new Map<string, HashTagTaskMapping[]>([['tag1', [{
                value: 'tag1',
                plannedOn: 20200828,
                taskId: 1234567,
                completed: false
            }, {
                value: 'tag1',
                plannedOn: 20200901,
                taskId: 12121212,
                completed: false
            }]], ['tag2', [{
                value: 'tag2',
                plannedOn: 20200828,
                taskId: 1234567,
                completed: false
            }]]]))

        expect(deltaMap).not.toBeNull()
        expect(deltaMap.size).toEqual(2)

        expect(deltaMap.get('tag1')).not.toBeNull()
        expect(deltaMap.get('tag1')?.length).toEqual(2)
        expect(deltaMap.get('tag1')).toContainEqual({
            value: 'tag1',
            plannedOn: completedTask.plannedOn,
            taskId: completedTask.id,
            completed: true
        })

        expect(deltaMap.get('tag1')).toContainEqual({
            value: 'tag1',
            plannedOn: 20200901,
            taskId: 12121212,
            completed: false
        })

        expect(deltaMap.get('tag2')).not.toBeNull()
        expect(deltaMap.get('tag2')?.length).toEqual(1)
        expect(deltaMap.get('tag2')).toContainEqual({
            value: 'tag2',
            plannedOn: completedTask.plannedOn,
            taskId: completedTask.id,
            completed: true
        })
    })
})

describe("HashTagUtils: undoCompleteHashTags", () => {
    it("should change completed to false for passed tag and task id", () => {
        const targetTask: Task = {
            id: 1234567,
            value: "Task value",
            plannedOn: 20200828,
            updatedOn: 987654,
            tags: ['tag1', 'tag2']
        }

        const deltaMap: Map<string, HashTagTaskMapping[]> = HashTagUtils.undoCompleteHashTags(
            targetTask,
            new Map<string, HashTagTaskMapping[]>([['tag1', [{
                value: 'tag1',
                plannedOn: 20200828,
                taskId: 1234567,
                completed: true
            }, {
                value: 'tag1',
                plannedOn: 20200901,
                taskId: 12121212,
                completed: true
            }]], ['tag2', [{
                value: 'tag2',
                plannedOn: 20200828,
                taskId: 1234567,
                completed: true
            }]]]))

        expect(deltaMap).not.toBeNull()
        expect(deltaMap.size).toEqual(2)

        expect(deltaMap.get('tag1')).not.toBeNull()
        expect(deltaMap.get('tag1')?.length).toEqual(2)
        expect(deltaMap.get('tag1')).toContainEqual({
            value: 'tag1',
            plannedOn: targetTask.plannedOn,
            taskId: targetTask.id,
            completed: false
        })

        expect(deltaMap.get('tag1')).toContainEqual({
            value: 'tag1',
            plannedOn: 20200901,
            taskId: 12121212,
            completed: true
        })

        expect(deltaMap.get('tag2')).not.toBeNull()
        expect(deltaMap.get('tag2')?.length).toEqual(1)
        expect(deltaMap.get('tag2')).toContainEqual({
            value: 'tag2',
            plannedOn: targetTask.plannedOn,
            taskId: targetTask.id,
            completed: false
        })
    })
})

export {}