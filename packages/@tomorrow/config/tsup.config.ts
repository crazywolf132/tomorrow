
import { defineConfig } from 'tsup';
import { tsupBuilder } from 'build-env';

export default defineConfig([tsupBuilder({
    entry: ['src/index.ts'],
    reactNative: false,
    cloneFile: false
})])
