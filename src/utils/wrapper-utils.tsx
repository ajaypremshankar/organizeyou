import React from 'react';
import Fade from '@material-ui/core/Fade';

export const wrapFade = (child: JSX.Element): JSX.Element => {
    return (
        <Fade in={true}>
            {child}
        </Fade>
    )
}