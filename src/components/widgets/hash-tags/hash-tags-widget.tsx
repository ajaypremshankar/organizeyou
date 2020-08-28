import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppStateService } from "../../../state-stores/tasks/app-state-service";
import { ColorUtils } from "../../../utils/color-utils";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            float: "left",
            marginLeft: '20px',
            textAlign: 'left',
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

    if(sortedKeyValueArr.length === 0) {
        return <div className={classes.root}>
            <span className={classes.noHashtags}>Your #tags will appear here.</span>
        </div>
    }

    return (
        <div className={classes.root}>{
            sortedKeyValueArr
                .map((value, index) => {
                    const noOfHashTags = value[1].filter(x => !x.completed).length

                    if (noOfHashTags <= 0) return null

                    return <span key={value[0]}
                                 style={{
                                     cursor: 'pointer',
                                     color: `${ColorUtils.getColorAt(index)}`,
                                     fontWeight: AppStateService.getSelectedList() === value[0] ? "bold" : "normal",
                                     fontSize: AppStateService.getSelectedList() === value[0] ? 'large' : 'medium'
                                 }} onClick={() => AppStateService.updateCurrentlySelectedList(value[0])}>
                            {<span>{value[0]}<sup className={classes.sup}>{noOfHashTags}</sup>&nbsp;&nbsp;&nbsp;</span>}
                        </span>
                })}
        </div>
    )
}