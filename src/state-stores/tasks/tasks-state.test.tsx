import { TasksState } from "./tasks-state";
import { HashTagTaskMapping, Task } from "../../types/types";

const getSampleNewTaskState = () => {
    const activeTask: Task = {
        id: 1234567,
        value: "Task value",
        plannedOn: 20200828,
        updatedOn: 987654,
        tags: ['tag1', 'tag2']
    }

    const newlyCreatedTaskState = TasksState.newStateFrom(
        20200828,
        "ListName",
        new Map<number, Task[]>([[20200828, [activeTask]]]),
        [{
            id: 3456789,
            value: "Task value",
            plannedOn: 20200827,
            updatedOn: 7654321,
            completedDate: 12345692,
            tags: ['tag3', 'tag4']
        }],
        new Map<string, HashTagTaskMapping[]>([['tag1', [{
            value: 'tag1',
            plannedOn: 20200828,
            taskId: 1234567,
            completed: false,
        }]]])
    )

    return {activeTask, newlyCreatedTaskState}
}

describe("TaskState: creation", () => {
    it("Sets all the fields", () => {

        const {activeTask, newlyCreatedTaskState} = getSampleNewTaskState()

        expect(newlyCreatedTaskState).not.toBeNull()
        expect(newlyCreatedTaskState.tasks).not.toBeNull()
        expect(newlyCreatedTaskState.completedTasks).not.toBeNull()
        expect(newlyCreatedTaskState.hashTags).not.toBeNull()

        expect(newlyCreatedTaskState.selectedDate).toEqual(20200828)
        expect(newlyCreatedTaskState.selectedList).toEqual('ListName')

        expect(newlyCreatedTaskState.tasks.size).toEqual(1)
        expect(newlyCreatedTaskState.tasks.get(20200828)?.length).toEqual(1)
        expect(newlyCreatedTaskState.tasks.get(20200828)).toEqual([activeTask])

        expect(newlyCreatedTaskState.completedTasks.length).toEqual(1)
        expect(newlyCreatedTaskState.completedTasks).toEqual([{
            id: 3456789,
            value: "Task value",
            plannedOn: 20200827,
            updatedOn: 7654321,
            completedDate: 12345692,
            tags: ['tag3', 'tag4']
        }])

        expect(newlyCreatedTaskState.hashTags.size).toEqual(1)
        expect(newlyCreatedTaskState.hashTags.get('tag1')?.length).toEqual(1)
        expect(newlyCreatedTaskState.hashTags.get('tag1')).toEqual([{
            value: 'tag1',
            plannedOn: 20200828,
            taskId: 1234567,
            completed: false,
        }])
    })
})

describe("TaskState: moveTask", () => {
    it("moves task from one list to other when valid key is given", () => {

        const {activeTask, newlyCreatedTaskState} = getSampleNewTaskState()

        const postMoveState = newlyCreatedTaskState.moveTask(20200828, {
            ...activeTask,
            plannedOn: 20200829
        })

        expect(postMoveState).not.toBeNull()
        expect(postMoveState.tasks).not.toBeNull()

        expect(postMoveState.selectedDate).toEqual(newlyCreatedTaskState.selectedDate)
        expect(postMoveState.selectedList).toEqual(newlyCreatedTaskState.selectedList)
        expect(postMoveState.completedTasks).toEqual(newlyCreatedTaskState.completedTasks)
        expect(postMoveState.hashTags).toEqual(newlyCreatedTaskState.hashTags)

        expect(postMoveState.tasks.size).toEqual(1)
        expect(postMoveState.tasks.get(20200828)).toBeUndefined()
        expect(postMoveState.tasks.get(20200829)).toEqual([{
            ...activeTask,
            plannedOn: 20200829
        }])
    })

    it("moves task from one list to other when valid from key is NOT given", () => {

        const {activeTask, newlyCreatedTaskState} = getSampleNewTaskState()

        const postMoveState = newlyCreatedTaskState.moveTask(20200827, {
            ...activeTask,
            plannedOn: 20200829
        })

        expect(postMoveState).not.toBeNull()
        expect(postMoveState.tasks).not.toBeNull()

        expect(postMoveState.selectedDate).toEqual(newlyCreatedTaskState.selectedDate)
        expect(postMoveState.selectedList).toEqual(newlyCreatedTaskState.selectedList)
        expect(postMoveState.completedTasks).toEqual(newlyCreatedTaskState.completedTasks)
        expect(postMoveState.hashTags).toEqual(newlyCreatedTaskState.hashTags)

        expect(postMoveState.tasks.size).toEqual(2)
        expect(postMoveState.tasks.get(20200828)).toEqual([activeTask])
        expect(postMoveState.tasks.get(20200827)).toBeUndefined()
        expect(postMoveState.tasks.get(20200829)).toEqual([{
            ...activeTask,
            plannedOn: 20200829
        }])
    })
})

describe("TaskState: completeTask", () => {
    it("when valid key is given, should complete properly", () => {

        const {activeTask, newlyCreatedTaskState} = getSampleNewTaskState()

        const postComplete = newlyCreatedTaskState.completeTask({
            ...activeTask,
            completedDate: 1234567632
        })

        expect(postComplete).not.toBeNull()
        expect(postComplete.tasks).not.toBeNull()
        expect(postComplete.completedTasks).not.toBeNull()

        expect(postComplete.selectedDate).toEqual(newlyCreatedTaskState.selectedDate)
        expect(postComplete.selectedList).toEqual(newlyCreatedTaskState.selectedList)
        expect(postComplete.completedTasks).not.toEqual(newlyCreatedTaskState.completedTasks)
        expect(postComplete.hashTags).toEqual(newlyCreatedTaskState.hashTags)

        expect(postComplete.tasks.size).toEqual(0)
        expect(postComplete.tasks.get(20200828)).toBeUndefined()
        expect(postComplete.completedTasks.length).toEqual(2)
        expect(postComplete.completedTasks).toContainEqual({
            ...activeTask,
            completedDate: 1234567632
        })
        expect(postComplete.completedTasks).toContainEqual(newlyCreatedTaskState.completedTasks[0])
    })

    it("when valid from key is NOT given, should just add new task to completed list", () => {

        const {activeTask, newlyCreatedTaskState} = getSampleNewTaskState()

        const postComplete = newlyCreatedTaskState.completeTask({
            ...activeTask,
            plannedOn: 20200827,
            completedDate: 1234567632
        })

        expect(postComplete).not.toBeNull()
        expect(postComplete.tasks).not.toBeNull()

        expect(postComplete.completedTasks).not.toEqual(newlyCreatedTaskState.completedTasks)
        expect(postComplete.hashTags).toEqual(newlyCreatedTaskState.hashTags)

        expect(postComplete.tasks.size).toEqual(1)
        expect(postComplete.tasks.get(20200828)).toEqual([activeTask])
        expect(postComplete.tasks.get(20200827)).toBeUndefined()

        expect(postComplete.completedTasks.length).toEqual(2)
        expect(postComplete.completedTasks).toContainEqual({
            ...activeTask,
            plannedOn: 20200827,
            completedDate: 1234567632
        })
        expect(postComplete.completedTasks).toContainEqual(newlyCreatedTaskState.completedTasks[0])
    })
})

describe("TaskState: undoCompleteTask", () => {
    it("when valid key is given, should undo complete properly", () => {

        const {activeTask, newlyCreatedTaskState} = getSampleNewTaskState()

        let completedTask = newlyCreatedTaskState.completedTasks[0];
        delete completedTask.completedDate

        const postUndoComplete = newlyCreatedTaskState.undoCompleteTask(completedTask)

        expect(postUndoComplete).not.toBeNull()
        expect(postUndoComplete.tasks).not.toBeNull()
        expect(postUndoComplete.completedTasks).not.toBeNull()

        expect(postUndoComplete.selectedDate).toEqual(newlyCreatedTaskState.selectedDate)
        expect(postUndoComplete.selectedList).toEqual(newlyCreatedTaskState.selectedList)
        expect(postUndoComplete.completedTasks).not.toEqual(newlyCreatedTaskState.completedTasks)
        expect(postUndoComplete.hashTags).toEqual(newlyCreatedTaskState.hashTags)

        expect(postUndoComplete.tasks.size).toEqual(2)
        expect(postUndoComplete.tasks.get(20200827)).toEqual([completedTask])
        expect(postUndoComplete.tasks.get(20200828)).toEqual([activeTask])

        expect(postUndoComplete.completedTasks.length).toEqual(0)
    })

    it("when valid from key is NOT given, should just add new task to tasks map", () => {

        const {activeTask, newlyCreatedTaskState} = getSampleNewTaskState()

        const postComplete = newlyCreatedTaskState.undoCompleteTask({
            ...activeTask,
            plannedOn: 20200827,
        })

        expect(postComplete).not.toBeNull()
        expect(postComplete.tasks).not.toBeNull()

        expect(postComplete.completedTasks).toEqual(newlyCreatedTaskState.completedTasks)
        expect(postComplete.hashTags).toEqual(newlyCreatedTaskState.hashTags)

        expect(postComplete.tasks.size).toEqual(2)
        expect(postComplete.tasks.get(20200828)).toEqual([activeTask])
        expect(postComplete.tasks.get(20200827)).toEqual([{
            ...activeTask,
            plannedOn: 20200827,
        }])
    })
})

//TODO Add task
//TODO remove task
//TODO remove completed task
//TODO selectedDate & selectedList

export {}