import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";

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
        textField: {
            width: '100%',
            marginBottom: '10px',
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
        if (window.chrome && window.chrome.tabs) {
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

        <TextField
            className={classes.textField}
            id="outlined-basic"
            label={`Search Google`}
            variant="outlined"
            size={'medium'}
            autoComplete={'off'}
            autoFocus
            inputProps={{minLength: 1, maxLength: process.env.REACT_APP_TASK_MAX_LIMIT}}
            onChange={(event) => setKeywordContentState(event.target.value)}
            onKeyDown={handleKeyPressChange}
        />

    );
}
