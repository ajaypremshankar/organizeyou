import { BookmarkTreeNode } from "../types/bookmark-node";

export const getBookmarkTree = (): Promise<BookmarkTreeNode[]> => {
    return new Promise((resolve, reject) => {
        if (window.chrome && window.chrome.bookmarks) {
            window.chrome.bookmarks.getTree(function (results: any) {
                const bookmarks: BookmarkTreeNode[] = [...results]
                resolve(bookmarks)
            })
        } else {
            resolve([
  {
    "children": [
      {
        "children": [
          {
            "dateAdded": 1589982300292,
            "id": "11",
            "index": 0,
            "parentId": "1",
            "title": "Mac keyboard shortcuts - Apple Support",
            "url": "https://support.apple.com/en-us/HT201236"
          },
          {
            "dateAdded": 1590417062869,
            "id": "12",
            "index": 1,
            "parentId": "1",
            "title": "PW | Slack | Ajay Prem Shankar",
            "url": "https://app.slack.com/client/T014RTHLHU0/D0140MLEHRT"
          },
          {
            "dateAdded": 1590486506998,
            "id": "13",
            "index": 2,
            "parentId": "1",
            "title": "Trello",
            "url": "https://trello.com/b/4UgkMYMB/ajs-career-goals"
          },
          {
            "dateAdded": 1590840162908,
            "id": "14",
            "index": 3,
            "parentId": "1",
            "title": "Amazon DynamoDB – Architecture and Features | AWS Training & Certification",
            "url": "https://www.aws.training/Details/eLearning?id=50877"
          },
          {
            "children": [
              {
                "dateAdded": 1596203908034,
                "id": "16",
                "index": 0,
                "parentId": "15",
                "title": "Edge Extension review",
                "url": "https://partner.microsoft.com/en-us/dashboard/microsoftedge/4bfb4fa6-29c3-484b-8c97-18594a4a5e0b/overview"
              },
              {
                "dateAdded": 1596287120667,
                "id": "17",
                "index": 1,
                "parentId": "15",
                "title": "Developer Dashboard",
                "url": "https://chrome.google.com/webstore/devconsole/422a44fb-89d5-49f8-a038-76389cfc4a2e"
              },
              {
                "dateAdded": 1596287162859,
                "id": "18",
                "index": 2,
                "parentId": "15",
                "title": "Developer Hub :: Add-ons for Firefox",
                "url": "https://addons.mozilla.org/en-US/developers/"
              },
              {
                "dateAdded": 1596962576904,
                "id": "20",
                "index": 3,
                "parentId": "15",
                "title": "MSI P Core i7 10th Gen - (16 GB/512 GB SSD/Windows 10 Home/4 GB Graphics) Prestige 15 A10SC-239IN Thin and Light Laptop Rs.118990 Price in India - Buy MSI P Core i7 10th Gen - (16 GB/512 GB SSD/Windows 10 Home/4 GB Graphics) Prestige 15 A10SC-239IN Thin and Light Laptop Black Online - MSI : Flipkart.com",
                "url": "https://www.flipkart.com/msi-p-core-i7-10th-gen-16-gb-512-gb-ssd-windows-10-home-4-graphics-prestige-15-a10sc-239in-thin-light-laptop/p/itm070ca9f1628ef?pid=COMFMJDVKEMKN4HE&lid=LSTCOMFMJDVKEMKN4HEVF1TZX"
              }
            ],
            "dateAdded": 1596978096420,
            "dateGroupModified": 1596978096420,
            "id": "15",
            "index": 4,
            "parentId": "1",
            "title": "chrome-dev"
          }
        ],
        "dateAdded": 1596978064555,
        "dateGroupModified": 1590840162908,
        "id": "1",
        "index": 0,
        "parentId": "0",
        "title": "Favorites bar"
      },
      {
        "children": [],
        "dateAdded": 1596978064555,
        "id": "2",
        "index": 1,
        "parentId": "0",
        "title": "Other favorites"
      }
    ],
    "dateAdded": 1597069147496,
    "id": "0",
    "title": ""
  }
])
        }
    });
}