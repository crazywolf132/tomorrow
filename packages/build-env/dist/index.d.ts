import { Options } from 'tsup';

interface Settings extends Options {
    reactNative?: boolean;
    cloneFile?: boolean;
}
declare const tsupBuilder: (settings: Settings) => Options;

export { tsupBuilder };
