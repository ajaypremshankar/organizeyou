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