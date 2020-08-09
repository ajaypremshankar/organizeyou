import { BookmarkTreeNode } from "../types/bookmark-node";

export const getBookmarkTree = (): Promise<BookmarkTreeNode[]> => {
    return new Promise((resolve, reject) => {
        if (window.chrome && window.chrome.bookmarks) {
            window.chrome.bookmarks.getTree(function (results: any) {
                const bookmarks: BookmarkTreeNode[] = [...results]
                resolve(bookmarks)
            })
        } else {
            resolve([{
                title: "Folder",
                id:'1',
                children: [{
                    id: '1.1',
                    title:'Google',
                    url: 'www.google.com'
                }]
            }])
        }
    });
}