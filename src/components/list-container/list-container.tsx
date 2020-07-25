import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import {DateTasks, Task} from "../../types/types";
import Typography from '@material-ui/core/Typography';
import {getDayTypeFromDate} from "../../utils/utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            width: '100%',
            margin: 'auto',
            maxWidth: 480,
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            textAlign: 'left',
            width: '100%',
            margin: 'auto',
            maxWidth: 480,
        }
    }),
);


export default function ListContainer(props: DateTasks) {

    console.log(props)

    const classes = useStyles();
    const [checked, setChecked] = React.useState([0]);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const tasks = Array.from(props.tasks)

    return (
        <div>
            <Typography variant="subtitle1" gutterBottom className={classes.title}>
                {getDayTypeFromDate(props.date).toUpperCase()}:
            </Typography>
            <List className={classes.list}>
                {tasks.map((value, index) => {
                    const labelId = `checkbox-list-label-${index}`;

                    return (
                        <ListItem key={labelId} role={undefined} dense button onClick={handleToggle(index)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{'aria-labelledby': labelId}}
                                />
                            </ListItemIcon>
                            {console.log(value.value)}
                            <ListItemText id={labelId} primary={value.value}/>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );
}
