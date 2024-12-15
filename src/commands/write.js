import { readFileSync, writeFileSync } from 'fs';

export const registerCommandWrite = (cli, active_collection) => {
	const active_collection_file = `${active_collection}.json`
    
    cli
		.command('w')
		.description('write note')
		.argument('<title>', 'title of note')
		.argument('<body>', 'note body')
		.action((arg_title, arg_body) => {
			const file = readFileSync(active_collection_file);
			const json = JSON.parse(file);
			json.push({ arg_title, arg_body, timestamp: Date.now() });
			const json_string = JSON.stringify(json);
			writeFileSync(active_collection_file, json_string);

			console.log(`Writing note titled '${arg_title}'`);
		});
};
