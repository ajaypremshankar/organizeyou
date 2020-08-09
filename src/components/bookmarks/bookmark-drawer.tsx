import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import BookmarkTree from "./bookmark-tree";
import Drawer from '@material-ui/core/Drawer';
import { getBookmarkTree } from "../../utils/bookmark-utils";
import TextField from '@material-ui/core/TextField';
import { BookmarkTreeNode } from "../../types/bookmark-node";

const useStyles = makeStyles({
    list: {
        width: '20vw',
        minWidth: '200px',
        textAlign:'left',
        marginLeft: '10px'
    },
    settingsBox: {
        position: 'fixed',
        top: '0px',
        opacity: '0.6',
    },
    BackdropProps: {
        background: 'transparent'
    },
    arrow: {
        position: 'fixed',
        right: '30px',
        top: '40px',
        opacity: '0.4',
        '&:hover': {
            cursor: 'pointer',
            opacity: '1.0',
        }
    }
});

interface BookmarkDrawerProps {
}

// TODO: https://stackblitz.com/edit/react-2h1g6x?file=index.js

export default function BookmarkDrawer(props: BookmarkDrawerProps) {
    const classes = useStyles();
    const [bookmarkTreeState, setBookmarkTreeState] = React.useState(<span></span>);
    const [bookmarkSearchState, setBookmarkSearchState] = React.useState('');
    useEffect(() => {
        getBookmarkTree().then(value => {
            if (value && value.length > 0) {
                setBookmarkTreeState(<BookmarkTree tree={filterData(value, bookmarkSearchState)}/>)
            }
        })
    }, [bookmarkSearchState])

    const filterData = (data: BookmarkTreeNode[], search: string): BookmarkTreeNode[] => {
        let r = data.filter(o => {
            if (o.title.toLowerCase().includes(search.toLowerCase())) return true
            if (o.children) o.children = filterData(o.children, search);
            return o.title.toLowerCase().includes(search.toLowerCase()) || (o.children && o.children.length > 0)
        })
        return r;
    }

    return (
            <React.Fragment key={'left'}>
                <Drawer
                    className={classes.list}
                    anchor={'left'}
                    open={true}
                    variant={"permanent"}>
                    <div
                        className={clsx(classes.list)}
                        role="presentation">
                        <TextField
                            style={{width: '100%', float: 'left',}}
                            id="standard-basic"
                            label="Search bookmarks"
                            variant={"standard"}
                            value={bookmarkSearchState}
                            onChange={(event) => setBookmarkSearchState(event.target.value)}
                        />
                        {bookmarkTreeState}
                    </div>
                </Drawer>
            </React.Fragment>
    );
}
