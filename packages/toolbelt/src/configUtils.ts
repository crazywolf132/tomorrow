import fs from 'fs-extra';
import path from 'path';

export const readConfigFile = () => {
    const configPath = path.join(process.cwd(), 'tomorrow.config.js');
    if (!fs.existsSync(configPath)) {
        return {};
    }
    return require(configPath);
}

