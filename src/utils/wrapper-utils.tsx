import { getCurrentMillis } from "./date-utils";

export const wrapThrottle = (func: any, timeFrame: number) => {
    let lastTime = 0;
    return function (...args: any) {
        const now = getCurrentMillis();
        if (now - lastTime >= timeFrame) {
            func(...args);
            lastTime = now;
        }
    };
}