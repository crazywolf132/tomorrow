#! /usr/bin/env node
import { Command as Commander } from 'commander';
import { Command } from 'typebook';
import log from 'debug';
import config from '@tomorrow/config';
import { version } from '../package.json';
import commands from './commands';

const debug = log.get('cli');

const program = new Commander();

program
    .name('BUILD-ENV')
    .description('Local package helper')
    .version(version);

debug('initialized');

commands.forEach((command: Command) => {
    debug('added command', command.name);
    let temp = program.command(command.name);

    for (const option of (command.options ?? [])) {
        let [flags, description, defaultValue] = option;
        temp.option(flags, description, defaultValue);
    }

    for (const argument of (command.arguments ?? [])) {
        let [flags, description = ""] = argument;
        temp.argument(flags, description);
    }

    temp.action(command.action);
});

program.parse(process.argv);