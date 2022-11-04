import type { Dictionary } from "./general";

export interface Command {
    name: string;
    description: string;
    options?: string[][];
    arguments?: string[][];
    action: (str: any, options: Dictionary<any>) => void;
}