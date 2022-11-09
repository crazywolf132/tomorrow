import { importCliServerApiFromProject } from 'toolbelt'

export const createDevServerMiddleware = (projectRoot: string, { watchFolders, port }: { watchFolders: readonly string[]; port: number; }) => {
    const { createDevServerMiddleware } = importCliServerApiFromProject(projectRoot);

    const {
        middleware,
        debuggerProxyEndpoint,
        messageSocketEndpoint,
        eventsSocketEndpoint,
        websocketEndpoints
    } = createDevServerMiddleware({
        port,
        watchFolders
    });

    return {
        middleware,
        debuggerProxyEndpoint,
        messageSocketEndpoint,
        eventsSocketEndpoint,
        websocketEndpoints
    }
}