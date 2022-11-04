import type { Config as IConfig } from 'typebook';
import { at, readConfigFile } from 'toolbelt';

export default class Config {
    private static config: Partial<IConfig> = readConfigFile();

    public static setConfig(config: IConfig) {
        this.config = config;
    }

    public static get(key: string): any {
        return at(this.config, key);
    }

    public static update(key: string, value: any): void {
        this.config[key] = value;
    }
}