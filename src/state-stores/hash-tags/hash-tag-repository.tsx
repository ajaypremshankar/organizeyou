import { HashTagTaskMapping } from "../../types/types";
import { hasBrowserStoragePermission } from "../../utils/platform-utils";
import { BucketUtils } from "../bucket/bucket-utils";

export class HashTagRepository {
    public static update = (deltaHashTags: Map<string, HashTagTaskMapping[]>) => {

        const deltaHashState = BucketUtils.getHashTagBuckets(deltaHashTags)

        if (hasBrowserStoragePermission()) {

            const hashTagStateToUpdate: any = {}
            const keysToDelete: string[] = []
            for (let key in deltaHashState) {
                const uniqueValues = Array.from(new Set(deltaHashState[key]))
                if (uniqueValues.length > 0) {
                    // Make sure no duplicates are being saved.
                    hashTagStateToUpdate[key] = uniqueValues
                } else {
                    keysToDelete.push(key)
                }
            }

            if (hashTagStateToUpdate !== {}) {
                chrome.storage.sync.set(hashTagStateToUpdate)
            }

            if (keysToDelete.length > 0) {
                chrome.storage.sync.remove(keysToDelete)
            }
        } else {
            for (let key in deltaHashState) {
                const uniqueValues = Array.from(new Set(deltaHashState[key]))
                if (uniqueValues.length > 0) {
                    localStorage.setItem(key, JSON.stringify(uniqueValues))
                } else {
                    localStorage.removeItem(key)
                }
            }
        }
    }
}