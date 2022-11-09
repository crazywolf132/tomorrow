// THIS IS OUR CONFIGURATION FOR THE TSUP COMMAND.
import fs from 'fs-extra';
import path from 'path';
import type { Options } from 'tsup'
import { settings } from '../package.json';

interface Settings extends Options {
    reactNative?: boolean;
    cloneFile?: boolean;
}

const { target, testRange, format } = settings;

const replaceExtension = (fileName: string, _format: string): string => {
    const parts = fileName.split('.');
    parts.pop();
    parts.push(_format === "cjs" ? "js" : _format === "esm" ? "mjs" : _format);
    return parts.join(".");
}

const cloneToTestRange = (pkgName: string, fileName: string, format: string): void => {
    fs.copyFileSync(path.join(process.cwd(), 'dist', replaceExtension(fileName, format)), path.resolve(testRange, 'node_modules', pkgName, 'dist', replaceExtension(fileName, format)))
}

export const tsupBuilder = (settings: Settings): Options => {
    // We are going to fetch the package.json file from their config.
    const cwd = process.cwd();
    const pkg = fs.readJSONSync(path.join(cwd, 'package.json'));
    const { name } = pkg;

    if (settings.target) {
        console.warn('[BUILD-ENV] Target is being overwritten by the settings in the "build-env/package.json" file.');
    }

    if (!settings.format) {
        console.warn(`[BUILD-ENV] Format is not defined in the settings. Defaulting to "${format}".`);
        settings.format = format;
    }

    if (!settings.name) {
        settings.name = name;
    }

    if (settings.dts == null) {
        settings.dts = true;
    }

    // We are going to create a new config object.
    const config: Settings = {
        ...settings,
        target,
        external: [...(settings.external ?? []), settings.reactNative ? 'react-native' : ''],
    }

    if (settings.cloneFile) {
        // @ts-ignore // This is a typing issue.
        config.onSuccess = () => {
            // We are going to clone the file to the test range.
            ((settings.entry ?? []) as string[]).forEach((entry: string, idx: number) => {
                // We will get the last part of the string, after the last slash.
                const fileName = entry.split('/').pop();
                cloneToTestRange(name, fileName!, Array.isArray(settings.format) ? settings.format[idx] : settings.format);
            });
        }
    }

    return config;
}