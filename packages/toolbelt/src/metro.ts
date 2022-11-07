import assert from 'assert';
import { readJsonSync, readJSONSync } from 'fs-extra';
import path from 'path';
import { uniqueItems } from './objUtils';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import { sync as globSync } from 'glob';
import type { LanguageOptions } from 'typebook';

export const globAllPackageJsonPaths = (
    workspaceProjectRoot: string,
    linkedPackages: string[]
): string[] => {
    return linkedPackages.map((glob) => {
        return globSync(path.join(glob, 'package.json').replace(/\\/g, '/'), {
            cwd: workspaceProjectRoot,
            absolute: true,
            ignore: ['**/@(Carthage|Pods|node_modules)/**'],
        }).map((pkgPath) => {
            try {
                return readJSONSync(pkgPath)
            } catch { }
            return null;
        });
    }).flat().filter(Boolean).map((p) => path.join(p as string));
}

export const getWorkspacePackagesArray = ({ workspaces }: any): string[] => {
    if (Array.isArray(workspaces)) {
        return workspaces;
    }

    assert(workspaces?.package, 'Could not find a `workspaces` object in the root package.');
    return workspaces.packages;
}

export const getWorkspaceRoot = (projectRoot: string): string | null => {
    try {
        return findWorkspaceRoot(projectRoot);
    } catch (error: any) {
        if (error.message.includes('Unexpected end of JSON input')) {
            return null;
        }
        throw error;
    }
}

export const getModulesPaths = (projectRoot: string): string[] => {
    const paths: string[] = [];

    const workspaceRoot = getWorkspaceRoot(path.resolve(projectRoot));
    if (workspaceRoot) {
        paths.push(path.resolve(projectRoot));
        paths.push(path.resolve(workspaceRoot, 'node_modules'));
    }

    return paths;
}

export const resolveAllWorkspacePackageJsonPaths = (workspaceProjectRoot: string) => {
    try {
        const rootPackageJsonFilePath = path.join(workspaceProjectRoot, 'package.json');
        // Could throw if package.json is malformed
        const rootPackageJson = readJsonSync(rootPackageJsonFilePath);

        // Extract the `packages` array or use `workspaces` as packages array (yarn workspaces)
        const packages = getWorkspacePackagesArray(rootPackageJson);

        // Glob all package.json files and return valid paths.
        return globAllPackageJsonPaths(workspaceProjectRoot, packages);
    } catch {
        return [];
    }
}

export const getWatchFolders = (projectRoot: string): string[] => {
    const workspaceRoot = getWorkspaceRoot(projectRoot);

    // Rely on default behavior in standard projects
    if (!workspaceRoot) {
        return [];
    }

    const packages = resolveAllWorkspacePackageJsonPaths(workspaceRoot);
    if (!packages.length) {
        return [];
    }

    return uniqueItems([
        path.join(workspaceRoot, 'node_modules'),
        ...packages.map(pkg => path.dirname(pkg))
    ])
}

export const getLanguageExtensionsInOrder = ({ isTS, isModern, isReact }: LanguageOptions) => {
    const addLanguage = (lang: string): string[] => [lang, isReact && `${lang}x`].filter(Boolean);

    let extensions = addLanguage('js')

    if (isModern) {
        extensions.unshift('mjs')
    }

    if (isTS) {
        extensions = [...addLanguage('ts'), ...extensions]
    }

    return extensions;
}


const _getExtensions = (platforms: string[], extensions: string[], workflows: string[]): string[] => {
    assert(Array.isArray(platforms), `Expected: 'platforms: string[]'`);
    assert(Array.isArray(extensions), `Expected: 'extensions: string[]'`);
    assert(Array.isArray(workflows), `Expected: 'workflows: string[]'`);

    const fileExtensions: string[] = [];
    // Support for `.tomorrow` files
    for (const workflow of [...workflows, '']) {
        // Ensure order is correct: [platformA.js, platformB.js, js]
        for (const platform of [...platforms, '']) {
            // Support both typescript and javascript
            for (const extension of extensions) {
                fileExtensions.push([platform, workflow, extension].filter(Boolean).join('.'));
            }
        }
    }
    return fileExtensions;
}

export const addMiscExtensions = (platforms: string[], fileExtensions: string[]): string[] => {
    fileExtensions.push('json');
    if (platforms.includes('web')) {
        fileExtensions.push('wasm')
    }
    return fileExtensions;
}

export const getExtensions = (platforms: string[], languageOptions: LanguageOptions = { isTS: true, isModern: true, isReact: true }): string[] => {
    const fileExtensions = _getExtensions(platforms, getLanguageExtensionsInOrder(languageOptions), []);
    addMiscExtensions(platforms, fileExtensions);
    return fileExtensions
}

export const createModuleMatcher = ({ folders = ['node_modules'], moduleIds }: { folders?: string[], moduleIds: string[] }) => {
    const modulePathsGroup = folders.join('|');
    const moduleMatchersGroup = moduleIds.join('|');
    const moduleMatcherId = '^' + [modulePathsGroup, moduleMatchersGroup].map((value) => `(?:${value})`).join('/');
    return new RegExp(moduleMatcherId);
}