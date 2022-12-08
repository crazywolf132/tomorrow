
import { defineConfig } from 'tsup';
import { tsupBuilder } from 'build-env';

export default defineConfig(
    [
        tsupBuilder({
            entry: ['src/index.ts'],
            reactNative: false,
            cloneFile: true,
            external: ['@tomorrow/metro', 'babel-preset-tomorrow'] // this is thanks to the import
        }),
        tsupBuilder({
            name: 'metro-babel-transformer',
            entry: ['src/metro-babel-transformer.ts'],
            external: ['@tomorrow/metro', 'babel-preset-tomorrow'],
            format: 'cjs',
            dts: false,
            reactNative: false,
            cloneFile: true
        })
    ]
)