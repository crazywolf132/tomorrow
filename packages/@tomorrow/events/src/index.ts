/**
 * We are just making `nanoevent` into a singleton.
 */
import NanoEvent from '@foxycorps/nanoevent';

export default class Events {
    private static ne: NanoEvent = new NanoEvent();

    public static on(type: string, callback: (...data: any) => void): void {
        this.ne.on(type, callback);
    }

    public static send(type: string, ...data: any): void {
        this.ne.emit(type, ...data)
    }
}