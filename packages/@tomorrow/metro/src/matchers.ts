import { createModuleMatcher } from "toolbelt";

export const nodeModulesPaths = ['node_modules'];
// Match any node modules, or monorepo module
export const nodeModuleMatcher = createModuleMatcher({ folders: nodeModulesPaths, moduleIds: [] });

// Match node modules which are so oddly written that they
// must be transpiled with every possible option. This is the slowest approach
export const impossibleNodeModuleMatcher = createModuleMatcher({
    moduleIds: [
        'react-native-reanimated',
        'nanoid',
        '@tomorrow/router',
        'victory'
    ],
    folders: nodeModulesPaths
});

export const reactNativeMatcher = ({ folders = nodeModulesPaths }: { folders?: string[] }) => createModuleMatcher({
    folders,
    moduleIds: ['react-native/']
});

export const tomorrowMatcher = ({ folders = nodeModulesPaths }: { folders?: string[] }) => createModuleMatcher({
    folders,
    moduleIds: ['tomorrowjs', 'tomorrow', '@tomorrow/']
})

export const problemModules = ({ moduleIds = [], folders = nodeModulesPaths }: { folders?: string[], moduleIds?: string[] }) => createModuleMatcher({
    folders,
    moduleIds: [
        ...moduleIds,
        '@react-',
        '@(?:[\\w|-]+)/react-native',
        'react-native-',
        'victory-',
        'native-base',
        'styled-components',
        'three/build/three.module.js',
        'three/examples/jsm',
        'html-elements/',
        'react-navigation-'
    ]
})