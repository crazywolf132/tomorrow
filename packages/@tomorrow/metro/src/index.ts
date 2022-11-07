import type MetroConfig from 'metro-config';
import path from 'path';
import resolveFrom from 'resolve-from';
import { INTERNAL_CALLSITES_REGEX } from './constants';
import type { LoadOptions } from 'typebook'
import { importMetroConfigFromProject, getExtensions, getWatchFolders, getModulesPaths, isURL } from 'toolbelt';
import config from '@tomorrow/config';

export const getDefaultConfig = (projectRoot: string): MetroConfig.InputConfigT => {

    const MetroConfig = importMetroConfigFromProject(projectRoot);
    const reactNativePath = path.dirname(resolveFrom(projectRoot, 'react-native/package.json'));

    const sourceExtsConfig = { isTS: true, isReact: true, isModern: false };
    const sourceExts = getExtensions([], sourceExtsConfig);
    sourceExts.push('cjs');

    const resolverMainFields: string[] = ['react-native', 'browser', 'main'];

    const watchFolders = getWatchFolders(projectRoot);
    const nodeModulesPaths = getModulesPaths(projectRoot);

    const {
        reporter,
        ...metroDefaultValues
    } = (MetroConfig as any).getDefaultConfig.getDefaultValues(projectRoot);

    return (MetroConfig as any).mergeConfig(metroDefaultValues, {
        watchFolders,
        resolver: {
            resolverMainFields,
            platforms: ['ios', 'android', 'native', 'testing'],
            assetExts: metroDefaultValues.resolver.assetExts.filter(assetExt => !sourceExts.includes(assetExt)),
            sourceExts,
            nodeModulesPaths
        },
        serializer: {
            getModulesRunBeforeMainModule: () => [
                require.resolve(path.join(reactNativePath, 'Libraries/Core/InitializeCore'))
            ],
            getPollyfills: () => require(path.join(reactNativePath, 'rn-get-polyfills'))(),
        },
        server: {
            port: Number(config.get('metro.port')) || Number(process.env.METRO_PORT) || 8081,
        },
        symbolicator: {
            customizeFrame: (frame: any) => {
                if (frame.file && isURL(frame.file)) {
                    return {
                        ...frame,
                        lineNumber: null,
                        column: null,
                        collapse: true
                    }
                }
                let collapse = Boolean(frame.file && INTERNAL_CALLSITES_REGEX.test(frame.file));
                if (!collapse) {
                    if (frame.column === 3 &&
                        frame.methodName === 'global code' &&
                        frame.file?.match(/^https?:\/\//g)) {
                        collapse = true;
                    }
                }
            }
        },
        transformer: {
            unstable_allowRequireContext: true,
            allowOptionalDependencies: true,
            babelTransformerPath: path.join(require.resolve('@tomorrow/metro'), '../../dist/metro-babel-transformer.js'),
            assetRegistryPath: 'react-native/Libraries/Image/AssetRegistry',
        }
    })
}

export const loadAsync = async (projectRoot: string, { reporter, ...metroOptions }: LoadOptions = {}): Promise<MetroConfig.ConfigT> => {
    let defaultConfig = getDefaultConfig(projectRoot);
    if (reporter) {
        defaultConfig = { ...defaultConfig, reporter }
    }

    const MetroConfig = importMetroConfigFromProject(projectRoot);
    return await MetroConfig.loadConfig(
        { cwd: projectRoot, projectRoot, ...metroOptions },
        defaultConfig
    )
}