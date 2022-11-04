import { Config as Config$1 } from 'typebook';

declare class Config {
    private static config;
    static setConfig(config: Config$1): void;
    static get(key: string): any;
    static update(key: string, value: any): void;
}

export { Config as default };
