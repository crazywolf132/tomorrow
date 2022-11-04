import type { Config as IConfig } from 'typebook';

export default class Config {
    private static config: Partial<IConfig> = {};

    public static setConfig(config: IConfig) {
        this.config = config;
    }

    public static get(key: string): any {
        return this.config[key];
    }

    public static update(key: string, value: any): void {
        this.config[key] = value;
    }
}