#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { registerCommandWrite } from './commands/write.js';
import { registerCommandRead } from './commands/read.js';
import { registerCommandList } from './commands/list.js';
import { registerCommandSwitch } from './commands/switch.js';

export function createCli() {
	const cli = new Command();
	const VERSION = '1.1.4';

	cli.name('nit').description('Minimal CLI to write notes').version(VERSION);

	let active_collection;
	let active_collection_file;

	if (!existsSync('state.json')) {
		const state_json = { active_collection: 'default_collection' };
		writeFileSync('state.json', JSON.stringify(state_json));
	}

	const state_file = readFileSync('state.json');
	const json_state = JSON.parse(state_file);

	active_collection = json_state.active_collection;
	active_collection_file = `${active_collection}.json`;

	if (!existsSync(active_collection_file)) {
		writeFileSync(active_collection_file, JSON.stringify([]));
	}

	registerCommandWrite(cli, active_collection);
	registerCommandRead(cli, active_collection);
	registerCommandList(cli, active_collection);
	registerCommandSwitch(cli);

	// Only call parse() when the script is executed directly, not when testing.
	if (!process.argv[1].includes('jest')) {
		cli.parse(process.argv);
	}

	return cli;
}

createCli();
