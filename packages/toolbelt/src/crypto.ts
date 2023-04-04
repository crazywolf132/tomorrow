import crypto from 'crypto';

export const getContentHash = (content: any) => {
    const md5 = crypto.createHash('md5');
    md5.update(content);
    return md5.digest('hex');
}