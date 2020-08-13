import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '15px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '5vw',
            '& > *': {
                margin: theme.spacing(4),
            },
        },
        input: {
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
    }),
);

export default function SearchBarWidget() {
    const classes = useStyles();
    const [keywordContentState, setKeywordContentState] = useState('');
    const setCurrentTab = (keyword: string) => {
        if(window.chrome && window.chrome.tabs) {
            window.chrome.tabs.getCurrent(tab => {
                if (tab && tab.id) {
                    window.chrome.tabs.update(tab.id, {url: `http://www.google.com/search?q=${keyword}`})
                }
            })
        } else {
            alert(keyword)
        }
    }

    const handleKeyPressChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (keywordContentState.trim() !== '' && event.key === 'Enter') {
            setCurrentTab(keywordContentState)
        }
    }

    return (
        <Paper component="form" className={classes.root}>
            <InputBase
                autoFocus
                value={keywordContentState}
                className={classes.input}
                placeholder="Search Google"
                inputProps={{ 'aria-label': 'search google' }}
                onKeyDown={handleKeyPressChange}
                onChange={(event) => setKeywordContentState(event.target.value)}
            />
            <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
                onClick={() => setCurrentTab(keywordContentState)}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}
