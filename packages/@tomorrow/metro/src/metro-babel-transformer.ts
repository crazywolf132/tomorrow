import { createModuleMatcher, getCacheKey } from "toolbelt";
import { impossibleNodeModuleMatcher, nodeModuleMatcher, nodeModulesPaths, problemModules, reactNativeMatcher, tomorrowMatcher } from "./matchers";
import { createMultiRuleTransformer, loaders } from "./multiRuleTransformer";

const transform = createMultiRuleTransformer({
    getRuleType({ filename }) {
        // is a node module, and is not one of the impossible modules
        return nodeModuleMatcher.test(filename) && !impossibleNodeModuleMatcher.test(filename) ? 'module' : 'app';
    },
    rules: [
        {
            name: 'bob',
            type: 'module',
            test: createModuleMatcher({ moduleIds: ['.*/lib/commonjs/'], folders: nodeModulesPaths }),
            transform: loaders.passthroughModule,
            warn: true
        },
        {
            name: 'react-native',
            type: 'module',
            test: reactNativeMatcher({ folders: nodeModulesPaths }),
            transform: loaders.reactNative,
        },
        {
            name: 'tomorrow',
            type: 'module',
            test: tomorrowMatcher({ folders: nodeModulesPaths }),
            transform: loaders.tomorrow,
        },
        {
            name: 'sucrase',
            type: 'module',
            test: problemModules({ folders: nodeModulesPaths }),
            transform: loaders.untranspiledModule,
        },
        {
            name: 'skip-module',
            type: 'module',
            test: () => true,
            transform: loaders.passthroughModule,
        },
        {
            name: 'babel',
            test: () => true,
            transform: loaders.ap
        }
    ]
})

module.exports = {
    getCacheKey,
    transform
}