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
            fontSize: 'xx-small'
        },
        noHashtags: {
            fontSize: "small",
            color: 'gray'
        }
    }),
);

interface HashTagsWidgetProps {

}

export default function HashTagsWidget(props: HashTagsWidgetProps) {
    const classes = useStyles();
    const sortedKeyValueArr = Array.from(AppStateService.getHashTags().entries())
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 5)

    if (sortedKeyValueArr.length === 0) {
        return <div className={classes.root}>
            <span className={classes.noHashtags}>Your #tags will appear here.</span>
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
            <div className={classes.root}>{
                sortedKeyValueArr
                    .map((value, index) => {
                        const noOfHashTags = value[1].filter(x => !x.completed).length

                        if (noOfHashTags <= 0) return null

                        const color = ColorUtils.getColorAt(index)
                        return <span key={value[0]}
                                     style={{
                                         cursor: 'pointer',
                                         color: `${color}`,
                                         fontWeight: AppStateService.getSelectedList() === value[0] ? "bold" : "normal",
                                         fontSize: AppStateService.getSelectedList() === value[0] ? 'large' : 'medium'
                                     }} onClick={() => AppStateService.updateCurrentlySelectedList(value[0])}>
                            {getSupSuffix(value[0], noOfHashTags)}
                        </span>
                    })}
            </div>
        </Tooltip>
    )
}