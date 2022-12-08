import { KeyPressHandler } from "./keyPressHandler";
import { Screen } from './screen';
import { Registry } from "./registry";
import Config from '@tomorrow/config';
import { CTRL_C, CTRL_D, CTRL_L, LOGO } from "./consts";
import Log from 'debug';

const debug = Log.get('ui-engine');

export default class UIEngine {
    private static currentMenu: number = 0; // This tells the system to load the first screen loaded.
    private static keyHandler: ((key: string) => void);
    private static screenStack: Screen[] = []; // This is going to be the list of all the screens

    private static registry: Registry;
    private static keyPressHandler: KeyPressHandler;
    private static listener: any;

    public static registerScreen(screen: Screen) {
        debug('register:', screen.screenName);
        this.screenStack.push(screen);
    }

    public static registerMainMenu(screen: Screen) {
        debug('register:', 'Main Menu')
        // We will put this at the front of the stack... as it is the one that should load first.
        this.screenStack.unshift(screen);
    }

    public static changeScreen(screenPosition: number | string) {
        if (typeof screenPosition === "string") {
            // We will loop through the screen stack and find the screen that matches the name.
            let foundScreen = this.screenStack.findIndex((screen) => screen.screenName === screenPosition);
            if (foundScreen === -1) {
                // We will throw an error as we could not find the screen.
                throw new Error(`Could not find screen with name: ${screenPosition}`);
            }
            // We will now set the screen position to the index of the screen.
            screenPosition = foundScreen
        }
        this.currentMenu = screenPosition;
        // We are going to ask the new screen to render
        this.display();
        // We are also going to attach the key handler
        UIEngine.keyHandler = this.screenStack[this.currentMenu].handleKeys;
    }
    public static start() {
        // Doing a quick check that we even have a screen...
        debug('starting...');
        if (!this.screenStack.length) {
            debug('No screens found', `Screen length: ${this.screenStack.length}`);
            throw new Error('No screens have been registered.');
        }

        debug('creating keypress handler');
        this.keyPressHandler = new KeyPressHandler(this.handleKeyPress);
        debug('creating interaction listener');
        this.listener = this.keyPressHandler.createInteractionListener();
        debug('creating registry');
        this.registry = new Registry(this.listener);
        debug('starting to intercept all terminal interactions');
        this.keyPressHandler.startIntercepting();

        debug('using first screen in stack to handle key presses')
        this.keyHandler = this.screenStack[0].handleKeys;

        // Everything is setup and ready to go... we will now render the first screen.
        this.display();
    }

    public static display() {
        // This is where we will load the logo.
        // We will check to see if the config allows for it first.
        if (Config.get('interface.showLogo') as boolean) {
            if (Config.get('interface.customLogo') as boolean) {
                // We will load the custom logo.
                debug('custom logo requested')
                console.log(Config.get('interface.logo') as string);
            } else {
                // We will just render our logo
                console.log(LOGO)
            }
        } else {
            debug('logo disabled');
        }
        debug(`asking ${this.screenStack[this.currentMenu].screenName} to render`);
        this.screenStack[this.currentMenu].render();
    }

    private static async handleKeyPress(key: string) {
        switch (key) {
            case CTRL_L:
                return UIEngine.display();
            case CTRL_C:
            case CTRL_D:
                UIEngine.registry.pause();
                try {
                    process.emit('SIGINT');
                    process.exit()
                } catch (error) {
                    throw error;
                }
        }

        // We are now going to use the key handler from the current screen.
        UIEngine.keyHandler(key);
    }
}

export { Screen, CTRL_C, CTRL_D, CTRL_L };