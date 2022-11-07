import crypto from 'crypto';
import { readFileSync } from 'fs-extra';
import { version } from '../package.json';

const cacheKeyParts = [
    readFileSync(__filename),
    version
];

export const getCacheKey = (): string => {
    const key = crypto.createHash('md5');
    cacheKeyParts.forEach(part => key.update(part));
    return key.digest('hex');
}