import type React from 'react';
import type { PickPartial } from './general';

export type ScreenProps<TOptions extends Record<string, any> = Record<string, any>> = {
    name?: string;
    redirect?: boolean | string;
    initialParams?: { [key: string]: any };
    options?: TOptions;
}

export type ExoticProps<T extends React.ComponentType<any>> = React.ForwardRefExoticComponent<
    React.PropsWithoutRef<PickPartial<React.ComponentProps<T>, "children">> &
    React.RefAttributes<unknown>
>;

export type DynamicConvention = { name: string; deep: boolean; }

export type RouteNode = {
    /** Load a route into memory. Returns the exports from a route. */
    loadRoute: () => any;

    /** Loaded initial route name. */
    initialRouteName?: string;
    /** nested routes */
    children: RouteNode[];
    /** Is the route a dynamic path */
    dynamic: null | DynamicConvention[];
    /** `index`, `error-boundary`, etc. */
    route: string;
    /** require.context key, used for matching children. */
    contextKey: string;
    /** Added in-memory */
    generated?: boolean;

    /** Internal screens like the directory or the auto 404 should be marked as internal. */
    internal?: boolean;
}

export type BranchNode = {
    name: string;
    children: BranchNode[];
    parents: string[];
    /** null when there is no file in a folder. */
    node: LeafNode | null;
};

export type LeafNode = Pick<RouteNode, "contextKey" | "loadRoute"> & {
    /** Like `(tab)/index` */
    normalizedName: string;
};
