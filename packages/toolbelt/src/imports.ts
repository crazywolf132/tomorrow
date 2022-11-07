import { MetroImportError } from '@tomorrow/errors';
import os from 'os';
import resolveFrom from 'resolve-from';
import type Metro from 'metro';
import type MetroConfig from 'metro-config';
import type { composeSourceMaps } from 'metro-source-map';

export const resolveFromProject = (projectRoot: string, moduleId: string): any => {
    const resolvedPath = resolveFrom.silent(projectRoot, moduleId);
    if (!resolvedPath) {
        throw new MetroImportError(projectRoot, moduleId)
    }
    return resolvedPath
}

export const importFromProject = (projectRoot: string, moduleId: string) => {
    return require(resolveFromProject(projectRoot, moduleId));
}

export const importMetroSourceMapComposeSourceMapsFromProject = (projectRoot: string): typeof composeSourceMaps => {
    return importFromProject(projectRoot, 'metro-source-map/src/composeSourceMaps');
}

export const importMetroConfigFromProject = (projectRoot: string): typeof MetroConfig => {
    return importFromProject(projectRoot, 'metro-config');
}

export const importMetroFromProject = (projectRoot: string): typeof Metro => {
    return importFromProject(projectRoot, 'metro');
}

export const importMetroServerFromProject = (projectRoot: string): typeof Metro.Server => {
    return importFromProject(projectRoot, 'metro/src/Server');
}

export const importCliServerApiFromProject = (projectRoot: string): typeof import("@react-native-community/cli-server-api") => {
    return importFromProject(projectRoot, '@react-native-community/cli-server-api');
}

export const importInspectorProxyFromProject = (projectRoot: string): { InspectorProxy: any } => {
    return importFromProject(projectRoot, 'metro-inspector-proxy');
}

export const importHermesCommandFromProject = (projectRoot: string, configLocation: string | null): string => {
    const platformExecutable = getHermesCommandPlatform();
    const hermesLocations = [
        // We will take priority from the config
        configLocation != null && configLocation.length >= 1 ? `${configLocation}/bin/hermes` : '',
        // We will also check the env
        process.env['REACT_NATIVE_OVERRIDE_HERMES_DIR'] ? `${process.env['REACT_NATIVE_OVERRIDE_HERMES_DIR']}/bin/hermes` : '',
        // Building hermes from source
        'react-native/ReactAndroid/hermes-engine/build/hermes/bin/hermesc',
        // Prebuilt hermesc in the official react-native 0.69+ releases
        `react-native/sdk/hermesc/${platformExecutable}`,
        // Legacy hermes-engine package
        `hermes-engine/${platformExecutable}`
    ];

    for (const location of hermesLocations) {
        try {
            return resolveFromProject(projectRoot, location)
        } catch { }
    }
    throw new Error('Cannot find the hermesc executable.')
}

export const getHermesCommandPlatform = (): string => {
    switch (os.platform()) {
        case 'darwin':
            return 'osx-bin/hermesc';;
        case 'linux':
            return 'linux64-bin/hermesc';
        case 'win32':
            return 'win64-bin/hermesc.exe';
        default:
            throw new Error(`Unsupported host platform for Hermes Compiler: ${os.platform()}`);
    }
}