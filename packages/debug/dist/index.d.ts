declare type LogReturn = (...parts: unknown[]) => any;
declare class LogBackend {
    private name;
    private color;
    private prevTime;
    constructor(name: string, color: string);
    private getTimeDifference;
    private clean;
    private getPrefix;
    protected log(...parts: unknown[]): any;
    getLogger(): LogReturn;
}
declare class Log {
    private static registered;
    private static usedColors;
    private static enabled;
    private static getByName;
    static getRandomColor(): string;
    static get(name: string): LogReturn;
    static setLevel(enabled?: boolean): void;
    static getLevel(): boolean;
}

export { LogBackend, Log as default };
