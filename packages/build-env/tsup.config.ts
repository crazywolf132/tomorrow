import { defineConfig } from 'tsup';
import { name } from './package.json';
const target = "es2015"

export default defineConfig([
    {
        name,
        entry: ['src/index.ts'],
        format: 'cjs',
        noExternal: ['fs-extra', 'fs'],
        dts: true,
        target
    },
    {
        name: `${name}-cli`,
        entry: ['src/cli.ts'],
        format: 'cjs',
        noExternal: ['commander'],
        dts: false,
        target
    }
]);