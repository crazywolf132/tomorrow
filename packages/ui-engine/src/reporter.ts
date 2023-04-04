// import { createProgressBar } from './progressBar';
import chalk from "chalk";
import { createSpinner } from "./spinner";
import Config from '@tomorrow/config'
import EE from '@tomorrow/events'

enum EVENTS {
    BUILD_START = 'bundle_build_started',
    BUILD_PROGRESS = "bundle_transform_progressed",
    BUILD_DONE = 'bundle_build_done',
    BUILD_FAILED = "bundle_build_failed",
    LOG = 'client_log',
    INIT_DONE = 'initialize_done'
}

interface ILoader {
    loader: any;
    startTime: number;
    platform: string;
}

export class Reporter {

    private loaders: Map<string, ILoader> = new Map();
    constructor() { }

    handleBuild(buildID: string, platform: string): void {
        if (this.loaders.has(buildID)) return;

        const loader = createSpinner('Building...')

        this.loaders.set(buildID, {
            loader,
            startTime: Date.now(),
            platform
        })
    }

    updateBuild(buildID: string, transformed: number, total: number) {
        if (!this.loaders.has(buildID)) return;
        const {
            loader
        } = this.loaders.get(buildID);

        loader.tick(1, total / transformed);
    }

    update(event: any) {
        if (event.type === EVENTS.BUILD_START) {
            const { buildID, bundleDetails: {
                platform
            } } = event;
            this.handleBuild(buildID, platform);
            return;
        }

        if (event.type === EVENTS.BUILD_PROGRESS) {
            const {
                buildID,
                transformedFileCount,
                totalFileCount
            } = event;
            this.updateBuild(buildID, transformedFileCount, totalFileCount);
            return;
        }

        if (event.type === EVENTS.BUILD_DONE) {
            const { buildID } = event;
            const { loader, startTime, platform } = this.loaders.get(buildID);
            loader.stop();
            this.loaders.delete(buildID);
            console.log(`${chalk.greenBright('✔')} ${chalk.bold.white(`[${platform}]`)} Build completed in ${Date.now() - startTime}ms\n`)
            return;
        }

        if (event.type === EVENTS.BUILD_FAILED) {
            const { buildID } = event;
            if (!this.loaders.has(buildID)) return;
            const { loader, startTime, platform } = this.loaders.get(buildID);
            loader.stop();
            this.loaders.delete(buildID);
            console.log(`${chalk.redBright('✘')} ${chalk.bold.white(`[${platform}]`)} Build failed in ${Date.now() - startTime}ms\n`)
            return;
        }

        if (event.type === EVENTS.LOG) {
            const { data } = event;
            // data is an array. We are going to check to see if the first item starts with a `{`
            // if it does... its an object, so we will use utils.inspect for it.
            // if it starts with `Warning`.... it should be marked as a warning.
            const isWarning = typeof data[0] === "string" && data[0].startsWith('Warning');
            const isError = typeof data[0] === "string" && data[0].startsWith('Error');
            if (Boolean(Config.get('interface.onlyInfoLogs')) && (isWarning || isError)) return;
            if (isWarning || isError) data[0] = data[0].replace('Error', '').replace('Warning', '');

            console.log(`${chalk[isWarning ? "bgYellow" : isError ? "bgRed" : "bgWhite"].blackBright(` ${isWarning ? "WARNING" : isError ? "ERROR" : "LOG"} `)}:`, ...data)
            return;
        }

        if (event.type === EVENTS.INIT_DONE) {
            const { port } = event;
            EE.send('server.Ready', port)
            return
        }

        console.log(event);
    }
}