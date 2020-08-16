import React from 'react';
import Fade from '@material-ui/core/Fade';

export const wrapFade = (child: JSX.Element): JSX.Element => {
    return (
        <Fade in={true}>
            {child}
        </Fade>
    )
}

export const wrapThrottle = (func: any, timeFrame: number) => {
    let lastTime = 0;
    return function (...args: any) {
        const now = new Date().getTime();
        if (now - lastTime >= timeFrame) {
            func(...args);
            lastTime = now;
        }
    };
}