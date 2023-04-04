import { Spinner } from './spinnerCore';

let currentSpinner: Spinner | null = null;

export function setSpinner(spinner: Spinner | null): void {
    currentSpinner = spinner;
}

export function getSpinner(): Spinner | null {
    return currentSpinner;
}

export function createSpinner(message: string) {
    if (process.stderr.clearLine == null) {
        return null;
    }

    const spinner = new Spinner(message);

    const logReal = console.log;
    const infoReal = console.info;
    const warnReal = console.warn;
    const errorReal = console.error;

    const wrapNativeLogs = (): void => {
        console.log = (...args: any) => spinner.interrupt(args);
        console.info = (...args: any) => spinner.interrupt(args);
        console.warn = (...args: any) => spinner.interrupt(args);
        console.error = (...args: any) => spinner.interrupt(args);
    }

    const resetNativeLogs = (): void => {
        console.log = logReal;
        console.info = infoReal;
        console.warn = warnReal;
        console.error = errorReal;
    }

    const originalTerminate = spinner.stop.bind(spinner);
    spinner.stop = () => {
        resetNativeLogs();
        setSpinner(null);
        originalTerminate();
    }

    // wrapNativeLogs();
    setSpinner(spinner);
    return spinner;
}