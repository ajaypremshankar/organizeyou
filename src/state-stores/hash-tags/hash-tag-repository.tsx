import { HashTagTaskMapping } from "../../types/types";
import { hasChromeStoragePermission } from "../../utils/platform-utils";
import { BucketUtils } from "../bucket/bucket-utils";

export class HashTagRepository {
    public static update = (deltaHashTags: Map<string, HashTagTaskMapping[]>) => {

        const deltaHashState = BucketUtils.getHashTagBuckets(deltaHashTags)

        if (hasChromeStoragePermission()) {
            chrome.storage.sync.set(deltaHashState)
        } else {
            for (let key in deltaHashState) {
                localStorage.setItem(key, JSON.stringify(deltaHashState[key]))
            }
        }
    }
}