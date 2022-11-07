import type { Reporter } from "./metro.reporter";

export type LanguageOptions = {
    isTS: boolean;
    isModern: boolean;
    isReact: boolean;
}

export interface LoadOptions {
    config?: string;
    maxWorkers?: number;
    port?: number;
    reporter?: Reporter;
    resetCache?: boolean;
    target?: any;
}