import type { Dictionary } from 'typebook';
import ms from 'ms';
import chalk from 'chalk';

type LogReturn = (...parts: unknown[]) => any;

export class LogBackend {
    private prevTime: number;
    constructor(private name: string, private color: string, private enabled: boolean = true) { };

    private getTimeDifference(): number {
        const currentTime = Number(new Date());
        const _ms = currentTime - (this.prevTime || currentTime);
        this.prevTime = currentTime;
        return _ms;
    }

    private clean(difference: number): string | number {
        return ms(difference);
    }

    private getPrefix(...parts: unknown[]): [string, ...unknown[]] {
        let prefix: string[] = [this.name];
        let rest: unknown[] = [];
        for (const part of parts) {
            if (typeof part === 'string') {
                // This is eligible for the prefix.
                if (part.endsWith(':')) {
                    prefix.push(part.replace(':', ''));
                    continue;
                }
            }

            rest.push(part);
        }
        return [`${chalk.hex(this.color)(`${prefix.join(':')}:`.replace('::', ':'))}`, ...rest];
    }

    protected log(...parts: unknown[]): any {
        const [prefix, ...rest] = this.getPrefix(...parts);
        if (this.enabled)
            console.log(prefix, ...rest, `${chalk.hex(this.color)(this.clean(this.getTimeDifference()))}`);
    }

    public updateStatus(enabled: boolean): void {
        this.enabled = enabled;
    }

    public getLogger(): LogReturn {
        return (...parts: unknown[]): any => this.log(...parts);
    }
}

export default class Log {
    private static registered: Dictionary<LogBackend> = {};
    private static usedColors: string[] = [];
    private static enabled: boolean = false;

    private static getByName(name: string): LogReturn {
        if (!(name in this.registered)) {
            // There is no logger by this name, so we will register it
            const newColor = this.getRandomColor();
            this.usedColors.push(newColor);
            this.registered[name] = new LogBackend(name, newColor, Log.enabled);
        }
        return this.registered[name].getLogger();
    }

    public static getRandomColor(): string {
        // We will generate a new random hex code. We will compare it against
        // the list of used ones, and keep generating one until we get a unique one.
        let color: string;
        do {
            color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).slice(0, 5);
        } while (this.usedColors.includes(color));
        return color;
    }

    static get(name: string) {
        return this.getByName(name);
    }

    static setLevel(enabled: boolean = true) {
        this.enabled = enabled;

        // We are now going to go through every registered logger and update their status.
        for (const name in this.registered) {
            this.registered[name].updateStatus(enabled);
        }
    }

    static getLevel(): boolean {
        return this.enabled
    }

    static getDebuggers(): Dictionary<LogBackend> {
        return this.registered
    }

    static getUsedColors(): string[] {
        return this.usedColors;
    }
}