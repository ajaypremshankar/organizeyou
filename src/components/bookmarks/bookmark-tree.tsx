import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { BookmarkTreeNode } from "../../types/bookmark-node";
import Link from "@material-ui/core/Link";
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
        textAlign: "left"
    },
});

interface BookmarkTreeProps {
    tree: BookmarkTreeNode[]
}

export default function BookmarkTree(props: BookmarkTreeProps) {
    const classes = useStyles();

    const getTreeItem = (node: BookmarkTreeNode): JSX.Element => {
        const nodeTitle = node.title.length === 0 ? 'Bookmarks' :
            (node.title.length < 30 ? node.title : node.title.substr(0, 30).concat('...'))

        return (<TreeItem
            key={node.id}
            nodeId={node.id}
            label={node.url ?
                <Tooltip title={nodeTitle || ''}>
                    <Link href={node.url}>{nodeTitle}</Link>
                </Tooltip> : nodeTitle}>
            {!node.url && node.children && node.children.map(value => getTreeItem(value))}
        </TreeItem>)
    }

    const getExpandedIds = (nodes: BookmarkTreeNode[], arr: string[]): string[] => {
        if (!nodes) {
            return [];
        }
        if (!arr) {
            arr = [];
        }

        nodes.forEach(value => {
            arr.push(value.id);
            if (value.children)
                getExpandedIds(value.children, arr);
        })
        return arr;
    }

    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
            expanded={getExpandedIds(props.tree, [])}>
            {props.tree.map(value1 => getTreeItem(value1))}
        </TreeView>)
}
