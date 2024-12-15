import { readFileSync, writeFileSync } from 'fs';

export const registerCommandSwitch = (cli) => {

	cli
		.command('c')
		.description('switch collection')
		.argument('<name>', 'name of collection')
		.option('-n, --new', 'create new collection')
		.action((arg_collection, option) => {
			let collection_file;
			const collection_file_path = `${arg_collection}.json`;

			try {
				collection_file = readFileSync(collection_file_path);
			} catch (e) {}

			const state_file = readFileSync('state.json');
			const json_state = JSON.parse(state_file);
			json_state.active_collection = arg_collection;

			if (collection_file) {
				writeFileSync('state.json', JSON.stringify(json_state));
				return;
			}

			if (Object.keys(option).length > 0) {
				writeFileSync(collection_file_path, JSON.stringify([]));
				writeFileSync('state.json', JSON.stringify(json_state));
				return;
			}

			console.log('Collection not found. Use -n option to create new collection.');
		});
};
