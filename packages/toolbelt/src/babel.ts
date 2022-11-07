import resolveFrom from "resolve-from";

export const getProjectBabelConfig = (projectRoot: string): string | undefined => {
    return (
        resolveFrom.silent(projectRoot, './babel.config.js') ||
        resolveFrom.silent(projectRoot, './.babelrc') ||
        resolveFrom.silent(projectRoot, './.babelrc.js')
    )
}