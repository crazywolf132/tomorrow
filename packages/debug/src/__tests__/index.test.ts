import Log from '../index';

let lastCalledColor = '';

jest.mock('chalk', () => ({
    default: {
        hex: (color: string) => {
            lastCalledColor = color;
            return (str: string) => str;
        }
    }
}));

// We can't use the original because it goes by system time. So if the system runs the test at a
// different speed to the others... it will yeild a different result.
jest.mock('ms', () => ({ default: () => '0ms' }));

describe('Debug', () => {
    describe('basics', () => {
        it('should create a new logger by name', () => {
            let testLog = Log.get('test');
            expect(testLog).toBeTruthy();
        });

        it('should return the same logger', () => {
            const before = Object.keys(Log.getDebuggers()).length;
            Log.get('test');
            const after = Object.keys(Log.getDebuggers()).length;
            expect(before).toEqual(after);
        });

        it('should provide a random color', () => {
            const newColor = Log.getRandomColor();
            expect(newColor).toBeTruthy();
        });

        it('should not provide a used color', () => {
            const usedColor = Log.getUsedColors();
            const newColor = Log.getRandomColor();
            expect(usedColor).not.toContain(newColor);
        });

        it('should use a different color for all 5 new loggers', () => {
            const loggers = ['test1', 'test2', 'test3', 'test4', 'test5'];
            loggers.forEach((name) => {
                Log.get(name);
            });

            const allLoggers = Log.getDebuggers(); // should be 6 because of the `test` logger.
            expect(Object.keys(allLoggers).length).toBe(6);

            const allColors = Log.getUsedColors();
            expect(allColors.length).toBe(6); // should be 6 because of the `test` logger.
        });

        it('should disable the logger', () => {
            Log.setLevel(false);
            expect(Log.getLevel()).toBeFalsy();
        });

        it('should enable the logger', () => {
            Log.setLevel(true);
            expect(Log.getLevel()).toBeTruthy();
        })
    })
    describe('logging', () => {
        let mockConsole;

        beforeEach(() => {
            mockConsole = jest.spyOn(console, 'log').mockImplementation(() => { });
        });

        afterEach(() => {
            mockConsole.mockRestore();
        });
        it('should log', () => {
            Log.get('test')('content');
            expect(mockConsole).toHaveBeenCalled();
            expect(mockConsole).toHaveBeenCalledWith('test:', 'content', '0ms');
        });

        it('should use the defined color', () => {
            let usedColors = Log.getUsedColors();
            Log.get('test')('color test')
            expect(usedColors).toContain(lastCalledColor);
        });

        it('should add a prefix', () => {
            Log.get('test')('prefix:', 'test');

            expect(mockConsole).toHaveBeenCalled();
            expect(mockConsole).toHaveBeenCalledWith('test:prefix:', 'test', '0ms');
        })
    })
})