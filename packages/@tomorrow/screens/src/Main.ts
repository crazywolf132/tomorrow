import UI, { Screen } from 'ui-engine';
import { bar } from './conts';
const l = console.log;

export class MainScreen extends Screen {
    constructor() {
        super("main-menu");
    }

    public handleKeys(key: string): void {
        console.log(`heard: ${key}`);
        switch (key) {
            case 'Q':
                process.exit();
            case 'S':
                // We will change the screen to the settings screen.
                UI.changeScreen("settings");
        }
    }

    render(): void {
        l(bar);
        l();
        l(`     R - Reload          |      S - Settings      `);
        l(`     D - Dev Tools       |      I - Inspector      `);
        l(`     i - IOS App         |      Q - Quit      `);
        l();
        l(bar);
    }
}