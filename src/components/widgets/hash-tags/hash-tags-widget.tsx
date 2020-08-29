import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppStateService } from "../../../state-stores/tasks/app-state-service";
import { ColorUtils } from "../../../utils/color-utils";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            float: "left",
            marginLeft: '20px',
            textAlign: 'left',
            wordWrap: 'normal',
        },
        sup: {
            fontWeight: 'normal',
            fontSize: '50%'
        },
        noHashtags: {
            fontSize: "small",
            color: '#adadad'
        }
    }),
);

interface HashTagsWidgetProps {

}

export default function HashTagsWidget(props: HashTagsWidgetProps) {
    const classes = useStyles();
    const sortedKeyValueArr = Array.from(AppStateService.getHashTags().entries())
        .map(value => [value[0], [...value[1].filter(x => !x.completed)]])
        .filter(value => value[1].length > 0)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, process.env.REACT_APP_MAX_HASH_TAGS ? Number(process.env.REACT_APP_MAX_HASH_TAGS) : 5)

    if (sortedKeyValueArr.length === 0) {
        return <div className={classes.root}>
            <span
                className={classes.noHashtags}>Your top {process.env.REACT_APP_MAX_HASH_TAGS ? Number(process.env.REACT_APP_MAX_HASH_TAGS) : 5} #tags will appear here.</span>
        </div>
    }

    function getSupSuffix(value: string, noOfHashTags: number) {
        return <span>{value}
            {AppStateService.getSelectedList() !== value ? <sup
                className={classes.sup}>{noOfHashTags}</sup> : <span></span>}
            &nbsp;&nbsp;&nbsp;</span>;
    }

    return (
        <Tooltip title='click to see tagged tasks'>
            <div className={classes.root}>
                <span style={{fontWeight: 'bold', opacity: '20%'}}>#&nbsp;&nbsp;</span>
                {
                sortedKeyValueArr
                    .map((value, index) => {

                        const color = ColorUtils.getColorAt(index)
                        return <span key={value[0] as string}
                                     style={{
                                         cursor: 'pointer',
                                         color: `${color}`,
                                         fontWeight: AppStateService.getSelectedList() === value[0] ? "bold" : "normal",
                                         fontSize: AppStateService.getSelectedList() === value[0] ? 'medium' : 'small'
                                     }} onClick={() => AppStateService.updateCurrentlySelectedList(value[0] as string)}>
                            {getSupSuffix(value[0] as string, value[1].length)}
                        </span>
                    })}
            </div>
        </Tooltip>
    )
}