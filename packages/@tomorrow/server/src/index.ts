// @ts-nocheck
import express from 'express';
import morgan from 'morgan';
import { Server } from 'http';
import { importFromProject } from "toolbelt";
import { createDevServerMiddleware } from "./createDevServerMiddleware";
import Log from 'debug';
const debug = Log.get('server');

export const runMetroServerAsync = async (projectRoot: string = process.cwd(), options: any) => {
    // const Metro = importMetroFromProject(projectRoot);
    debug('getting tomorrow metro config')
    const tomorrowMetroConfig = importFromProject(projectRoot, '@tomorrow/metro');
    debug('getting metro config')
    const metroConfig = await tomorrowMetroConfig.loadAsync(projectRoot, { ...options });

    debug('getting devServer middleware')
    const { eventsSocketEndpoint, websocketEndpoints, messageSocketEndpoint, middleware } = createDevServerMiddleware(projectRoot, {
        port: metroConfig.server.port,
        watchFolders: metroConfig.watchFolders
    });

    debug('express:', 'starting')
    const app = express();
    debug('express:', 'added json support')
    app.use(express.json());
    debug('express:', 'adding morgan')
    app.use(morgan('dev'));
    debug('express:', 'adding middleware');
    app.use(middleware);

    debug('server:', 'starting');
    const server = new Server(app);
    debug('server:', 'listening')
    server.listen(metroConfig.server.port);

    // debug('attaching server tyo HMR')
    // middleware.attachHmrServer(server);

    return {
        websocketEndpoints,
        messageSocket: messageSocketEndpoint,
        app,
        server
    }
}