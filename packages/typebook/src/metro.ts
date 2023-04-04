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

export interface BundleOptions {
    entryPoint: string;
    platform: 'android' | 'ios' | 'web';
    dev?: boolean;
    minify?: boolean;
    sourceMapUrl?: string;
}

export interface BundleOutput {
    code: string;
    map: string;
    hermesBytecodeBundle?: Uint8Array;
    hermesSourcemap?: string;
    assets: readonly BundleAssetWithFileHashes[];
}

type AssetDataWithoutFiles = {
    readonly __packager_asset: true;
    readonly fileSystemLocation: string;
    readonly hash: string;
    readonly height: number | null | undefined;
    readonly httpServerLocation: string;
    readonly name: string;
    readonly scales: Array<number>;
    readonly type: string;
    readonly width: number | null | undefined;
};

type AssetData = AssetDataWithoutFiles & { readonly files: Array<string> };

export interface BundleAssetWithFileHashes extends AssetData {
    fileHashes: string[]
}