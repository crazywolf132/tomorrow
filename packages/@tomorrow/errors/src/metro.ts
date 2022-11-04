export class MetroImportError extends Error {
    constructor(projectRoot: string, moduleId: string) {
        super(
            `Missing package "${moduleId}" in the project at: ${projectRoot}\n` +
            `This usually means "react-native" is not installed.\n` +
            `Quick fix: run \`npx tomorrowjs fix\`.\n` +
            `Alternative: Ensure that \`tomorrowjs\` is installed in the project.`
        )
    }
}