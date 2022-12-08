import chalk from 'chalk';

export const CTRL_C = '\u0003';
export const CTRL_L = '\u000C';
export const CTRL_D = '\u0004';
export const ESC = 'ESC';

export const LOGO = chalk.hex("#F49FB6")`

████████ ███    ███ ██████  ██     ██         ██ ███████ 
   ██    ████  ████ ██   ██ ██     ██         ██ ██      
   ██    ██ ████ ██ ██████  ██  █  ██         ██ ███████ 
   ██    ██  ██  ██ ██   ██ ██ ███ ██    ██   ██      ██ 
   ██    ██      ██ ██   ██  ███ ███  ██  █████  ███████ 
                                                         
`

export const clear = (): void => {
   process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}