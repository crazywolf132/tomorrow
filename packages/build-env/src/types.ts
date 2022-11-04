export interface Dictionary<T> {
    [key: string]: T;
}

export interface Command {
    name: string;
    description: string;
    options?: string[][];
    arguments?: string[][];
    action: (str: any, options: Dictionary<any>) => void;
}