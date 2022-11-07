import fs from 'fs-extra';
import path from 'path';
import { Config } from 'typebook';

export const readConfigFile = (defaultConfig: Config) => {
    const configPath = path.join(process.cwd(), 'tomorrow.config.js');
    if (!fs.existsSync(configPath)) {
        return defaultConfig;
    }
    const configFile = require(configPath);
    if (typeof configFile === "function") {
        return configFile(defaultConfig);
    }
    return configFile;
}

