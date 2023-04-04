import { stderr } from "process"

export class Spinner {

    private frames: string[] = [
        "🌑 ",
        "🌒 ",
        "🌓 ",
        "🌔 ",
        "🌕 ",
        "🌖 ",
        "🌗 ",
        "🌘 "
    ];
    private currentFrame: number = 0;
    private stream: typeof stderr = stderr;
    private lastDraw: string = "";
    private betweenFrames: number = 80;
    private currentTick: number = 80;


    constructor(private text: string) { };

    public start() {
        this.tick();
    }

    private getFrame() {
        const newTick = this.currentTick++;
        if (newTick === this.betweenFrames) {
            // This means that it is time to update the frame.
            this.currentFrame++;
            this.currentTick = 0;
        }

        if (this.currentFrame >= this.frames.length) {
            this.currentFrame = 0;
        }

        return this.frames[this.currentFrame]
    }

    public tick() {
        const str = `${this.getFrame()} ${this.text}`

        if (this.lastDraw != str) {
            this.stream.cursorTo(0);
            this.stream.write(str);
            this.stream.clearLine(1);
            this.lastDraw = str;
        }

    }

    public interrupt(message: any) {
        // @ts-ignore
        // this.stream.clearLine();
        // this.stream.cursorTo(0);
        // // this.stream.write(message);
        // this.stream.write("\n");
        // this.stream.write(this.lastDraw);
    }

    public stop() {
        if (this.stream.clearLine) {
            // @ts-ignore
            this.stream.clearLine();
            this.stream.cursorTo(0);
        }
    }
}