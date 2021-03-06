import React from 'react';
import { createMuiTheme, createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import { formatToKey, getTodayKey, isPastKey, parseFromKey } from "../../utils/date-utils";
import { Badge } from "@material-ui/core";
import { Task } from "../../types/types";
import { AppStateService } from "../../state-stores/tasks/app-state-service";
import { ThemeProvider } from "@material-ui/styles";
import { SettingsStateService, SettingsType } from "../../state-stores/settings/settings-state";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fullWidth: {
            width: '100%'
        },
        datePicker: {
            '& > *': {
                margin: theme.spacing(1),
            },
        },
        customBadge: {
            backgroundColor: "#4791db",
            color: "white",
            fontSize: 'smaller'
        }
    }),
);

interface AppDatePickerProps {
    label: string
    open: boolean
    value: number
    dateChange: (date: number) => void
    close: () => void
}

export default function AppDatePicker(props: AppDatePickerProps) {
    const classes = useStyles();
    const handleDateChange = (date: MaterialUiPickersDate) => {
        if (date) {
            props.dateChange(formatToKey(date.toDate()))
        }
        props.close()
    };

    const defaultMaterialTheme = createMuiTheme({
        overrides: {
            MuiPaper: {
                root: {
                    opacity: SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? 0.8 : 1
                }
            }
        },
        palette: {
            type: SettingsStateService.isEnabled(SettingsType.DARK_THEME) && !SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? 'dark' : 'light',
            primary: {
                main: SettingsStateService.isEnabled(SettingsType.DARK_THEME) && !SettingsStateService.isEnabled(SettingsType.BACKGROUND_MODE) ? '#FFFF' : '#1976d2',
            },
        },

    });

    const tasksMap: Map<number, Task[]> = AppStateService.getTasks()

    function getRenderDay(day: MaterialUiPickersDate, selectedDate: MaterialUiPickersDate, dayInCurrentMonth: boolean, dayComponent: JSX.Element) {
        if (day == null) return dayComponent

        const currentKey = formatToKey(day.toDate())
        const tasksOnDay = tasksMap.get(currentKey)
        const isSelected = !isPastKey(currentKey) && dayInCurrentMonth
            && tasksOnDay && tasksOnDay.length > 0;

        // You can also use our internal <Day /> component
        return isSelected ? <Badge
            overlap="circle"
            badgeContent={isSelected && tasksOnDay ? tasksOnDay.length : undefined}
            variant={"dot"}
            classes={{badge: classes.customBadge}}
            color={"secondary"}>{dayComponent}</Badge> : dayComponent;

    }

    return (

        <div style={{display: 'none'}}>
            <ThemeProvider theme={defaultMaterialTheme}>
                <MuiPickersUtilsProvider
                    libInstance={moment} utils={MomentUtils}>
                    <DatePicker
                        disableToolbar
                        disablePast
                        variant="dialog"
                        label={props.label}
                        value={parseFromKey(getTodayKey())}
                        onChange={handleDateChange}
                        autoOk={true}
                        format='YYYYMMDD'
                        open={props.open}
                        onClose={() => props.close()}
                        renderDay={getRenderDay} />
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </div>

    );
}
