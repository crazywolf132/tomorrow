import resolveFrom from 'resolve-from'
// @ts-ignore -- We know it does actually have this.
import type { BabelTransformer, BabelTransformerArgs } from 'metro-babel-transformer';
import { getBabelConfig } from './getBabelConfig';
import Config from '@tomorrow/config';

let babelCore: typeof import('@babel/core') | undefined;
let babelParser: typeof import('@babel/parser') | undefined;

export const getBabelCoreFromProject = (projectRoot: string): typeof import('@babel/core') => {
    if (babelCore) return babelCore;
    babelCore = require(resolveFrom(projectRoot, '@babel/core'));
    return babelCore!;
}

export const getBabelParserFromProject = (projectRoot: string): typeof import('@babel/parser') => {
    if (babelParser) return babelParser;
    babelParser = require(resolveFrom(projectRoot, '@babel/parser'));
    return babelParser!;
}

export const regularBabel = (args: BabelTransformerArgs) => {
    const { filename, options, src, plugins } = args;
    const babelConfig = {
        sourceType: 'unambiguous',
        ...getBabelConfig(filename, options, plugins),
        caller: {
            name: 'metro',
            platform: options.platform
        },
        ast: true
    };

    const { parseSync, transformFromAstSync } = getBabelCoreFromProject(options.projectRoot);
    const sourceAst = parseSync(src, babelConfig);

    // Very rarely, the source code is not valid JavaScript. In that case, we just return an empty ast
    if (!sourceAst) return { ast: null };

    const result = transformFromAstSync(sourceAst, src, babelConfig);

    return { ast: !result ? null : result.ast, functionMap: null };
}

export const sucrase = (args: BabelTransformerArgs, { transforms }: { transforms: string[] }): Partial<ReturnType<BabelTransfomer['transform']>> => {
    const {
        src,
        filename,
        options: { dev }
    } = args;
    const { transform } = require('sucrase');

    const results = transform(src, {
        filePath: filename,
        production: !dev,
        transforms
    });

    return {
        code: results.code,
        functionMap: null
    }
}

export const getExpensiveSucraseTransforms = (filename: string) => ['jsx', 'imports', /\.tsx?$/.test(filename) ? 'typescript' : 'flow'];
export const parseAST = (projectRoot: string, sourceCode: string) => {
    const babylon = getBabelParserFromProject(projectRoot);

    return babylon.parse(sourceCode, {
        sourceType: 'unambiguous'
    });
}

export const createMultiRuleTransformer = ({ getRuleType, rules }: { getRuleType: (args: BabelTransformerArgs) => string; rules: any[]; }): BabelTransformer['transform'] => {
    return function transform(args: BabelTransformerArgs) {
        const { filename, options } = args;
        const OLD_BABEL_ENV = process.env.BABEL_ENV;
        process.env.BABEL_ENV = options?.dev ? 'development' : process.env.BABEL_ENV || 'production';
        try {
            const ruleType = getRuleType(args);

            for (const rule of rules) {
                // optimization for checking node modules
                if (rule.type && rule.type !== ruleType) {
                    continue;
                }

                const isMatched = typeof rule.test === 'function' ? rule.test(args) : rule.test.test(args.filename);
                if (isMatched) {
                    let results = rule.transform(args);
                    results._ruleName = rule.name;

                    if (results.code && !results.ast) {
                        results.ast = parseAST(options?.projectRoot, results.code);
                    }
                    return results;
                }
            }
            throw new Error('No loader rule to handle file: ' + filename);
        } finally {
            if (OLD_BABEL_ENV) {
                process.env.BABEL_ENV = OLD_BABEL_ENV
            }
        }
    }
}

export const loaders: Record<string, (args: BabelTransformerArgs) => any> = {
    app(args) {
        return regularBabel(args);
    },

    reactNativeModule(args) {
        return sucrase(args, { transforms: ['jsx', 'flow', 'imports'] })
    },

    tomorrowModule(args) {
        let res = sucrase(args, {
            transforms: ['jsx', 'imports', 'typescript']
        });

        // TODO: HERE WE SHOULD REPLACE ENV's
        res.code = res.code.replaceAll('process.env.TOMORROW_APP_SLUG', Config.get('core.appSlug'));

        return res;
    },
    untranspiledModule(args) {
        return sucrase(args, {
            transforms: getExpensiveSucraseTransforms(args.filename)
        })
    },

    passthroughModule(args) {
        const { options, src } = args;

        // Perform a basic ast partse, this doesn't matter since the worker will parse and ignore anyways
        const ast = parseAST(options.projectRoot, src);

        return {
            code: src,
            ast
        }
    }
}