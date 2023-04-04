import UI, { Screen, ESC } from "ui-engine";
import { bar } from "./conts";

const l = console.log

export class Settings extends Screen {
    constructor() {
        super("settings");
    }

    handleKeys(key: string): void {
        switch (key) {
            case ESC:
                UI.changeScreen(0);
        }
    }

    render(): void {
        l(bar);
        l();
        l(`     d - Toggle Debug          |      ESC - Go Back      `);
        l();
        l(bar);
    }
}