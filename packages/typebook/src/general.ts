export interface Dictionary<T> {
    [key: string]: T;
}

export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface RequireContext {
    keys(): string[];
    (id: string): any;
    <T>(id: string): T;
    resolve(id: string): string;
    id: string;
}