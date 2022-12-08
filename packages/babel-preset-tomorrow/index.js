const config = require('@tomorrow/config');

const lazyImportsBlackList = require('./lazy-imports-blacklist')

let hasWarnedJsxRename = false;

module.exports = function (api, options = {}) {
    const { web = {}, native = {} } = options;

    const bundler = api.caller(getBundler);
    const isWebpack = bundler === 'webpack';
    let platform = api.caller(getPlatform);

    if (!platform && isWebpack) {
        platform = 'web';
    }

    const platformOptions = platform === 'web' ? {
        // Disabling when webpack is used, because metro doesnt support tree-shaking
        disableImportExportTransform: !!isWebpack,
        ...web
    } : { disableImportExportTransform: false, ...native }

    // `metro-react-native-babel-preset` will handle `lazyImports` if it is not set.
    const lazyImportsOption = options && options.lazyImports;

    const extraPlugins = [];

    if ('useTransformReactJsxExperimental' in platformOptions && !hasWarnedJsxRename) {
        hasWarnedJsxRename = true;
        console.warn(
            'The useTransformReactJsxExperimental option has been renamed to transformReactJsxExperimental. ' +
            'Please update your configuration.'
        );
    }

    if (!platformOptions.useTransformReactJSXExperimental) {
        extraPlugins.push([
            require('@babel/plugin-transform-react-jsx'),
            {
                // Defaults to `automatic`. Use `classic` to use the old JSX behaviour.
                runtime: (options && options.jsxRuntime) || 'automatic',
                ...(options && options.jsxRuntime !== 'classic' && { importSource: (options && options.jsxImportSource) || 'react' }),
            }
        ])
    }

    return {
        presets: [
            [
                require('metro-react-native-babel-preset'),
                {
                    withDevTools: platformOptions.withDevTools,
                    disableFlowStripTypesTransform: platformOptions.disableFlowStripTypesTransform,
                    enableBabelRuntime: platformOptions.enableBabelRuntime,
                    unstable_transformProfile: platformOptions.unstable_transformProfile,
                    useTransformReactJSXExperimental: true,
                    disableImportExportTransform: platformOptions.disableImportExportTransform,
                    lazyImportExportTransform:
                        lazyImportsOption === true
                            ? (importModuleSpecifier) => {
                                return !(importModuleSpecifier.includes('./') || lazyImportsBlackList.has(importModuleSpecifier));
                            }
                            : lazyImportsOption
                }
            ]
        ],
        plugins: [
            getObjectRestSpreadPlugin(),
            ...extraPlugins,
            getAliasPlugin(),
            [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
            platform === 'web' && [require.resolve('babel-plugin-react-native-web')],
            isWebpack && platform !== 'web' && [require.resolve('./plugins/disable-ambiguous-requires')],
        ]
    }
}

// TODO: Crazywolf132 - Need to implement this with the config system. So we can allow for the user to define overrides
function getAliasPlugin() {
    const aliases = {};

    if (Object.keys(aliases).length) {
        return [
            require.resolve('babel-plugin-module-resolver'),
            {
                alias: aliases
            }
        ]
    }
    return [];
}

function getObjectRestSpreadPlugin() {
    return [require.resolve('@babel/plugin-proposal-object-rest-spread'), { loose: false }]
}

// TODO: This will be used to check the override configurations
function hasModule(name) {
    try {
        return !!require.resole(name);
    } catch (error) {
        if (error.code === "MODULE_NOT_FOUND" && error.message.includes(name)) {
            return false;
        }
        throw error;
    }
}

function getPlatform(caller) {
    return caller && caller.platform;
}

function getBundler(caller) {
    if (!caller) return null;

    const { bundler, name } = caller;

    if (!bundler) {
        switch (name.toLowerCase()) {
            case 'metro':
                return 'metro';
            case 'next-babel-turbo-loader':
                return 'webpack';
            case 'babel-loader':
                return 'webpack';
        }
    }

    return bundler || null;
}