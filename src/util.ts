export const debounce = <U extends unknown[]>(callback: (...args: U) => void, wait: number): ((...args: U) => void) => {
    let timeoutId: number | null = null;
    return (...args: U) => {
        if (timeoutId !== null) window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => void callback(...args), wait);
    };
};
