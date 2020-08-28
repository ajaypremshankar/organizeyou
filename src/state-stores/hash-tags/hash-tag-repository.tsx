import { HashTagTaskMapping } from "../../types/types";
import { hasChromeStoragePermission } from "../../utils/platform-utils";
import { BucketUtils } from "../bucket/bucket-utils";

export class HashTagRepository {
    public static update = (deltaHashTags: Map<string, HashTagTaskMapping[]>) => {

        const deltaHashState = BucketUtils.getHashTagBuckets(deltaHashTags)

        if (hasChromeStoragePermission()) {

            const hashTagStateToUpdate: any = {}
            const keysToDelete: string[] = []
            for (let key in deltaHashState) {
                if (deltaHashState[key].length > 0) {
                    hashTagStateToUpdate[key] = deltaHashState[key]
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
                if (deltaHashState[key].length > 0) {
                    localStorage.setItem(key, JSON.stringify(deltaHashState[key]))
                } else {
                    localStorage.removeItem(key)
                }
            }
        }
    }
}