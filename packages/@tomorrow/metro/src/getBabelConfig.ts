import fs from 'fs-extra';
import path from 'path';
// @ts-ignore -- We know it does actually have this.
import type { BabelTransformerOptions } from 'metro-babel-transformer';
import type { PluginItem as BabelPlugins, PluginItem } from '@babel/core';
import resolveFrom from 'resolve-from';

const getBabelRc = (() => {
    let babelRC: {
        presets?: any;
        extends?: string;
        plugins: BabelPlugins
    } | null = null;

    return function _getBabelRC(projectRoot: string, options: BabelTransformerOptions) {
        if (babelRC != null) {
            return babelRC;
        }

        babelRC = { plugins: [] };

        // Let's look for a babel config file in the project root.
        let projectBabelRCPath;

        // .babelrc
        if (projectRoot) {
            projectBabelRCPath = path.resolve(projectRoot, '.babelrc');
        }

        if (projectBabelRCPath) {
            // .babelrc.js
            if (!fs.existsSync(projectBabelRCPath)) {
                projectBabelRCPath = path.resolve(projectRoot, '.babelrc.js');
            }

            // babel.config.js
            if (!fs.existsSync(projectBabelRCPath)) {
                projectBabelRCPath = path.resolve(projectRoot, 'babel.config.js');
            }

            //If we found a babel config file, extend our config off it. Otherwise
            // the default config will be used
            if (fs.existsSync(projectBabelRCPath)) {
                babelRC.extends = projectBabelRCPath;
            }
        }

        // If a babel config file doesn't exist in the project then
        // the default preset for `react-native` will be used.
        if (!babelRC.extends) {
            const { experimentalImportSupport, ...presetOptions } = options;

            // Use `babel-preset-tomorrow` instead of `metro-react-native-babel-preset`
            const presetPath = resolveFrom.silent(projectRoot, 'babel-preset-tomorrow') ?? resolveFrom.silent(projectRoot, 'metro-react-native-babel-preset') ?? require.resolve('babel-preset-tomorrow');

            babelRC.presets = [
                [
                    require(presetPath),
                    {
                        // Default to React 17 automatic JSX transform
                        jsxRuntime: 'automatic',
                        ...presetOptions,
                        disableImportExportTransform: experimentalImportSupport,
                        enableBabelRuntime: options.enableBabelRuntime
                    }
                ]
            ]
        }
        return babelRC;
    }
})();

export const getBabelConfig = (filename: string, options: BabelTransformerOptions, plugins: BabelPlugins[]) => {
    const babelRC = getBabelRc(options.projectRoot, options);

    const extraConfig = {
        babelrc: typeof options.enableBabelRCLookup === 'boolean',
        code: false,
        filename,
        highlightCode: true
    }

    const config: any = { ...babelRC, ...extraConfig };

    // Add extra plugins
    const extraPlugins: (string | PluginItem)[] = [];

    config.plugins = extraPlugins.concat(config.plugins, plugins);

    if (options.dev && options.hot) {
        const mayContainEditableReactComponents = filename.indexOf('node_modules') === -1;

        if (mayContainEditableReactComponents) {
            if (!config.plugins) {
                config.plugins = [];
            }

            // Add react refresh runtime
            config.plugins.push(resolveFrom.silent(options.projectRoot, 'react-refresh/babel'))
        }
    }
    return { ...babelRC, ...config };
}