import { CTRL_C } from "./consts";

export class KeyPressHandler {
    private isIntercepting: boolean = false;
    private isHandlingKeyPress: boolean = false;

    constructor(public onPress: (key: string) => Promise<any>) { }

    /** Start observing interaction pause listeners. */
    createInteractionListener() {
        // Support observing prompts
        let wasIntercepting = false;

        const listener = ({ pause }: { pause: boolean }) => {
            if (pause) {
                wasIntercepting = this.isIntercepting;
                this.stopIntercepting();
            } else if (wasIntercepting) {
                this.startIntercepting();
            }
        }

        return listener;
    }


    private handleKeyPress = async (key: string) => {
        if (this.isHandlingKeyPress && key !== CTRL_C) {
            return;
        }

        this.isHandlingKeyPress = true;

        try {
            // We handle the `escape` key here
            await this.onPress(key.charCodeAt(0) === 127 ? 'ESC' : key);
        } catch (error) {
            console.error(error);
        } finally {
            this.isHandlingKeyPress = false;
        }
    }

    startIntercepting() {
        if (this.isIntercepting) {
            return;
        }

        this.isIntercepting = true;
        const { stdin } = process;

        if (!stdin.setRawMode) {
            return;
        }

        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        stdin.on('data', this.handleKeyPress)
    }

    stopIntercepting() {
        if (!this.isIntercepting) {
            return;
        }

        this.isIntercepting = false;
        const { stdin } = process;
        stdin.removeListener('data', this.handleKeyPress);

        if (!stdin.setRawMode) {
            return;
        }

        stdin.setRawMode(false);
        stdin.resume();
    }
}