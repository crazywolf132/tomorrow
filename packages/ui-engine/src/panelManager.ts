import { serializeError } from 'serialize-error';

export class PanelManager {
    static instance: PanelManager;

    private reportEvent: (event: any) => void;

    constructor() {}

    public static getInstance(): PanelManager {
        if (!PanelManager.instance) {
            PanelManager.instance = new PanelManager();
        }

        return PanelManager.instance;
    }

    setEventReporter(_eventReporter: ((event: any) => void) = () => {}): void {
        this.reportEvent = _eventReporter;
    }

    startConnection() {
        // We will start the connection to the website.
        // We assume that you are running the device locally
    }

    processLog(event: any) {
        if (event.error instanceof Error) {
            event.error = serializeError(event.error);
        }

        this.reportEvent(event);
    }
}