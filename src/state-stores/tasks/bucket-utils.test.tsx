import { BucketUtils, TASK_STATE_ACTION } from "./bucket-utils";
import { getTodayKey } from "../../utils/date-utils";
import { CompletedTask, Task } from "../../types/types";

describe("BucketUtils", () => {
    it("Deserialize to BaseState ", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364799,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            }, {
                "id": 1598125854668,
                "plannedOn": 20200824,
                "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "createdOn": 1598125854668,
                "updatedOn": 1598128081131,
                "completedDate": 1598126195038
            }, {
                "id": 1598030370042,
                "plannedOn": 20200828,
                "value": "load and loki",
                "createdOn": 1598030370042,
                "updatedOn": 1598128090602
            }, {
                "id": 1598176239318,
                "plannedOn": 20200823,
                "value": "Add to today.",
                "createdOn": 1598176239318,
                "updatedOn": 1598176239318
            }, {
                "id": 1598176250847,
                "plannedOn": 20200823,
                "value": "overflow: overlay;",
                "createdOn": 1598176250847,
                "updatedOn": 1598176250847
            }, {
                "id": 1598176260591,
                "plannedOn": 20200823,
                "value": "But putting this in a HTML file should go fine.",
                "createdOn": 1598176260591,
                "updatedOn": 1598176260591
            }],
            oy_at_29: [{
                "id": 1598126372283,
                "plannedOn": 20200924,
                "value": "Here you can find the full list and description for DatePicker props.",
                "createdOn": 1598126372283,
                "updatedOn": 1598128099727
            }],
            oy_ct_28: [{
                "id": 1598080240647,
                "plannedOn": 20200821,
                "value": "This wiki will be the first port of call of many thousands of Manjaro users, bot",
                "createdOn": 1598080240647,
                "updatedOn": 1598080240647,
                "completedDate": 1598127472017
            }, {
                "id": 1598125838045,
                "plannedOn": 20200823,
                "value": "import { DatePicker } from '@material-ui/pickers'",
                "createdOn": 1598125838045,
                "updatedOn": 1598125838045,
                "completedDate": 1598127472803
            }]
        }

        const baseState = BucketUtils.deserializeToBaseState(bucketedData)

        expect(baseState.selectedDate).toEqual(getTodayKey())
        expect(baseState.tasks).not.toBeNull()
        expect((baseState.tasks as Map<number, Task[]>).size).toEqual(4)

        expect(baseState.tasks.get(20200823)).not.toBeNull()
        expect(baseState.tasks.get(20200823).length).toEqual(3)
        expect(baseState.tasks.get(20200823)).toContainEqual({
            "id": 1598176260591,
            "plannedOn": 20200823,
            "value": "But putting this in a HTML file should go fine.",
            "createdOn": 1598176260591,
            "updatedOn": 1598176260591
        })

        expect(baseState.tasks.get(20200824)).not.toBeNull()

        expect(baseState.tasks.get(20200828)).not.toBeNull()
        expect(baseState.tasks.get(20200828).length).toEqual(2)
        expect(baseState.tasks.get(20200828)).toContainEqual({
            "id": 1598030370042,
            "plannedOn": 20200828,
            "value": "load and loki",
            "createdOn": 1598030370042,
            "updatedOn": 1598128090602
        })

        expect(baseState.tasks.get(20200924)).not.toBeNull()

        expect(baseState.completedTasks).not.toBeNull()
        expect((baseState.completedTasks as CompletedTask[]).length).toEqual(2)
        expect(baseState.completedTasks).toContainEqual({
            "id": 1598125838045,
            "plannedOn": 20200823,
            "value": "import { DatePicker } from '@material-ui/pickers'",
            "createdOn": 1598125838045,
            "updatedOn": 1598125838045,
            "completedDate": 1598127472803
        })
    })

    it("getBucketedState: ADD_UPDATE_TASK -> add task in current bucket", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364799,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            }, {
                "id": 1598125854668,
                "plannedOn": 20200824,
                "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "createdOn": 1598125854668,
                "updatedOn": 1598128081131,
                "completedDate": 1598126195038
            },
            ]
        }

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.ADD_UPDATE_TASK, 20200828, {
            "id": 1598030370042,
            "plannedOn": 20200828,
            "value": "load and loki",
            "createdOn": 1598030370042,
            "updatedOn": 1598128090602
        }, bucketedData)

        expect(newBucketedData['oy_at_28']).not.toBeNull()
        expect(newBucketedData['oy_at_28'].length).toEqual(3)
        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598030370042,
            "plannedOn": 20200828,
            "value": "load and loki",
            "createdOn": 1598030370042,
            "updatedOn": 1598128090602
        })
    })

    it("getBucketedState: ADD_UPDATE_TASK -> try to add task when current state is empty", () => {

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.ADD_UPDATE_TASK, 20200831, {
            "id": 1598030370042,
            "plannedOn": 20200830,
            "value": "load and loki",
            "createdOn": 1598030370042,
            "updatedOn": 1598128090602
        }, undefined)

        expect(newBucketedData['oy_at_38']).not.toBeNull()
        expect(newBucketedData['oy_at_38'].length).toEqual(1)
        expect(newBucketedData['oy_at_38']).toContainEqual({
            "id": 1598030370042,
            "plannedOn": 20200830,
            "value": "load and loki",
            "createdOn": 1598030370042,
            "updatedOn": 1598128090602
        })
    })

    it("getBucketedState: ADD_UPDATE_TASK -> add task in new bucket", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364799,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            },
            ]
        }

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.ADD_UPDATE_TASK, 20200831, {
            "id": 1598030370042,
            "plannedOn": 20200831,
            "value": "load and loki",
            "createdOn": 1598030370042,
            "updatedOn": 1598128090602
        }, bucketedData)

        expect(newBucketedData['oy_at_28']).toBeUndefined()
        expect(newBucketedData['oy_at_38']).not.toBeNull()
        expect(newBucketedData['oy_at_38'].length).toEqual(1)
        expect(newBucketedData['oy_at_38']).toContainEqual({
            "id": 1598030370042,
            "plannedOn": 20200831,
            "value": "load and loki",
            "createdOn": 1598030370042,
            "updatedOn": 1598128090602
        })
    })

    it("getBucketedState: ADD_UPDATE_TASK -> update task in a bucket", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364799,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            }, {
                "id": 1598125854668,
                "plannedOn": 20200824,
                "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "createdOn": 1598125854668,
                "updatedOn": 1598128081131,
            }
            ]
        }

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.ADD_UPDATE_TASK, 20200824, {
            "id": 1598125854668,
            "plannedOn": 20200824,
            "value": "bbbbbbbbbb",
            "createdOn": 1598125854668,
            "updatedOn": 1598126195038,
        }, bucketedData)

        expect(newBucketedData['oy_at_28']).not.toBeNull()
        expect(newBucketedData['oy_at_28'].length).toEqual(2)
        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598125854668,
            "plannedOn": 20200824,
            "value": "bbbbbbbbbb",
            "createdOn": 1598125854668,
            "updatedOn": 1598126195038,
        })

        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598030364799,
            "plannedOn": 20200828,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136
        })

        expect(newBucketedData['oy_at_28']).not.toContainEqual({
            "id": 1598125854668,
            "plannedOn": 20200824,
            "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "createdOn": 1598125854668,
            "updatedOn": 1598128081131,
        })
    })

    it("getBucketedState: MOVE_TASK -> move task to another plannedOn date, fromKey !== toKey", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364799,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            }, {
                "id": 1598125854668,
                "plannedOn": 20200824,
                "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "createdOn": 1598125854668,
                "updatedOn": 1598128081131,
            }
            ]
        }

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.MOVE_TASK, 20200828, {
            "id": 1598030364799,
            "plannedOn": 20200831,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
        }, bucketedData)

        expect(Object.keys(newBucketedData).length).toEqual(2)
        expect(newBucketedData['oy_at_28']).not.toBeNull()
        expect(newBucketedData['oy_at_28'].length).toEqual(1)
        expect(newBucketedData['oy_at_28']).not.toContainEqual({
            "id": 1598030364799,
            "plannedOn": 20200828,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
        })

        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598125854668,
            "plannedOn": 20200824,
            "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "createdOn": 1598125854668,
            "updatedOn": 1598128081131,
        })

        expect(newBucketedData['oy_at_38']).toContainEqual({
            "id": 1598030364799,
            "plannedOn": 20200831,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
        })
    })

    it("getBucketedState: MOVE_TASK -> move task to another plannedOn date, fromKey === toKey", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364799,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            }, {
                "id": 1598125854668,
                "plannedOn": 20200824,
                "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "createdOn": 1598125854668,
                "updatedOn": 1598128081131,
            }
            ]
        }

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.MOVE_TASK, 20200828, {
            "id": 1598030364799,
            "plannedOn": 20200829,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
        }, bucketedData)

        expect(Object.keys(newBucketedData).length).toEqual(1)
        expect(newBucketedData['oy_at_28']).not.toBeNull()
        expect(newBucketedData['oy_at_28'].length).toEqual(2)
        expect(newBucketedData['oy_at_28']).not.toContainEqual({
            "id": 1598030364799,
            "plannedOn": 20200828,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
        })

        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598125854668,
            "plannedOn": 20200824,
            "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "createdOn": 1598125854668,
            "updatedOn": 1598128081131,
        })

        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598030364799,
            "plannedOn": 20200829,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
        })
    })

    it("getBucketedState: DELETE_TASK when task exists", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364799,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            }, {
                "id": 1598125854668,
                "plannedOn": 20200824,
                "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "createdOn": 1598125854668,
                "updatedOn": 1598128081131,
            }
            ]
        }

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.DELETE_TASK, 20200828, {
            "id": 1598030364799,
            "plannedOn": 20200828,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
        }, bucketedData)

        expect(Object.keys(newBucketedData).length).toEqual(1)
        expect(newBucketedData['oy_at_28']).not.toBeNull()
        expect(newBucketedData['oy_at_28'].length).toEqual(1)
        expect(newBucketedData['oy_at_28']).not.toContainEqual({
            "id": 1598030364799,
            "plannedOn": 20200828,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
        })

        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598125854668,
            "plannedOn": 20200824,
            "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "createdOn": 1598125854668,
            "updatedOn": 1598128081131,
        })
    })

    it("getBucketedState: DELETE_TASK when task does NOT exist", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364799,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            }, {
                "id": 1598125854668,
                "plannedOn": 20200824,
                "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                "createdOn": 1598125854668,
                "updatedOn": 1598128081131,
            }
            ]
        }

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.DELETE_TASK, 20200828, {
            "id": 1598126372283,
            "plannedOn": 20200828,
            "value": "Here you can find the full list and description for DatePicker props.",
            "createdOn": 1598126372283,
            "updatedOn": 1598128099727,
        }, bucketedData)

        expect(Object.keys(newBucketedData).length).toEqual(1)
        expect(newBucketedData['oy_at_28']).not.toBeNull()
        expect(newBucketedData['oy_at_28'].length).toEqual(2)
        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598030364799,
            "plannedOn": 20200828,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
        })

        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598125854668,
            "plannedOn": 20200824,
            "value": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "createdOn": 1598125854668,
            "updatedOn": 1598128081131,
        })

        expect(newBucketedData['oy_at_28']).not.toContainEqual({
            "id": 1598126372283,
            "plannedOn": 20200828,
            "value": "Here you can find the full list and description for DatePicker props.",
            "createdOn": 1598126372283,
            "updatedOn": 1598128099727,
        })
    })

    it("getBucketedState: COMPLETE_TASK when task is in list", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364799,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            }, {
                "id": 1598125854668,
                "plannedOn": 20200824,
                "value": "aaaaaaaaaaaaa",
                "createdOn": 1598125854668,
                "updatedOn": 1598128081131,
            }
            ]
        }

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.COMPLETE_TASK, 20200828, {
            "id": 1598030364799,
            "plannedOn": 20200828,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
            "completedDate": 1598127472017,
        }, bucketedData)

        expect(Object.keys(newBucketedData).length).toEqual(2)
        expect(newBucketedData['oy_at_28']).not.toBeNull()
        expect(newBucketedData['oy_at_28'].length).toEqual(1)
        expect(newBucketedData['oy_at_28']).not.toContainEqual({
            "id": 1598030364799,
            "plannedOn": 20200828,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136
        })

        expect(newBucketedData['oy_ct_28']).not.toBeNull()
        expect(newBucketedData['oy_ct_28'].length).toEqual(1)
        expect(newBucketedData['oy_ct_28']).toContainEqual({
            "id": 1598030364799,
            "plannedOn": 20200828,
            "value": "load and lock",
            "createdOn": 1598030364799,
            "updatedOn": 1598030384136,
            "completedDate": 1598127472017
        })
    })

    it("getBucketedState: UNDO_COMPLETE_TASK", () => {
        const bucketedData = {
            oy_at_28: [{
                "id": 1598030364790,
                "plannedOn": 20200828,
                "value": "load and lock",
                "createdOn": 1598030364799,
                "updatedOn": 1598030384136
            }, {
                "id": 1598125854668,
                "plannedOn": 20200824,
                "value": "aaaaaaaaaaaaa",
                "createdOn": 1598125854668,
                "updatedOn": 1598128081131,
            }],
            oy_ct_28: [{
                "id": 1598080240647,
                "plannedOn": 20200821,
                "value": "This wiki will be the first port of call of many thousands of Manjaro users, bot",
                "createdOn": 1598080240647,
                "updatedOn": 1598080240647,
                "completedDate": 1598127472017,
            }, {
                "id": 1598125838045,
                "plannedOn": 20200823,
                "value": "import { DatePicker } from '@material-ui/pickers'",
                "createdOn": 1598125838045,
                "updatedOn": 1598125838045,
                "completedDate": 1598127472803
            }]
        }

        const newBucketedData = BucketUtils.getBucketedState(TASK_STATE_ACTION.UNDO_COMPLETE_TASK, 20200821, {
            "id": 1598080240647,
            "plannedOn": 20200821,
            "value": "This wiki will be the first port of call of many thousands of Manjaro users, bot",
            "createdOn": 1598080240647,
            "updatedOn": 1598080240647,
            "completedDate": 1598127472017,
        }, bucketedData)

        expect(Object.keys(newBucketedData).length).toEqual(2)
        expect(newBucketedData['oy_at_28']).not.toBeNull()
        expect(newBucketedData['oy_at_28'].length).toEqual(3)
        expect(newBucketedData['oy_at_28']).toContainEqual({
            "id": 1598080240647,
            "plannedOn": 20200821,
            "value": "This wiki will be the first port of call of many thousands of Manjaro users, bot",
            "createdOn": 1598080240647,
            "updatedOn": 1598080240647,
            "completedDate": 1598127472017,
        })

        expect(newBucketedData['oy_ct_28']).not.toBeNull()
        expect(newBucketedData['oy_ct_28'].length).toEqual(1)
        expect(newBucketedData['oy_ct_28']).not.toContainEqual({
            "id": 1598080240647,
            "plannedOn": 20200821,
            "value": "This wiki will be the first port of call of many thousands of Manjaro users, bot",
            "createdOn": 1598080240647,
            "updatedOn": 1598080240647,
            "completedDate": 1598127472017,
        })
    })
})


export {}