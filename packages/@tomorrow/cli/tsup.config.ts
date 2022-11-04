import { tsupBuilder } from 'build-env';
import { defineConfig } from 'tsup';

export default defineConfig([tsupBuilder({
    entry: ['src/index.ts'],
    reactNative: false,
    cloneFile: false
})])