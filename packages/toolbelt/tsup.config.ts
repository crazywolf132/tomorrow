
import { defineConfig } from 'tsup';
import { tsupBuilder } from 'build-env';

export default defineConfig([
    tsupBuilder({
        entry: ['src/index.ts'],
        reactNative: true,
        cloneFile: true,
        external: ["@tomorrow/metro"]
    }),
    tsupBuilder({
        name: 'Native',
        entry: ['src/native.ts'],
        reactNative: true,
        cloneFile: true,
        external: ["@tomorrow/metro"]
    })
])
