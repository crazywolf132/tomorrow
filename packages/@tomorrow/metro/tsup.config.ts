
import { defineConfig } from 'tsup';
import { tsupBuilder } from 'build-env';

export default defineConfig([tsupBuilder({
    entry: ['src/index.ts'],
    reactNative: false,
    cloneFile: false,
    external: ['@tomorrow/metro'] // this is thanks to the import
})])