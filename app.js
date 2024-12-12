import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'fs';
const cli = new Command();

cli.name('nit').description('Minimal CLI to write notes').version('0.0.1');

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

cli
	.command('r')
	.description('read note')
	.argument('<title>', 'title of note')
	.action((arg_title) => {

		const file = readFileSync(active_collection_file);
		const json = JSON.parse(file);
		const note_array = json.filter((element) => element.arg_title === arg_title);
		
        if (note_array.length > 1){
            console.log('There are multiple notes with that title:')
            note_array.forEach(note => {
                console.log(`${note.arg_body} (${new Date(note.timestamp).toISOString()})`);
            });
            return;
        };
        
        if (note_array.length === 1){
            console.log(`${note.arg_body}`);
            return;
        };
            
        console.log(`No such note found in collection ${active_collection_file}`)
	});

cli
	.command('c') // collection
	.description('switch collection')
	.argument('<name>', 'name of collection')
    .option('-n, --new', 'create new collection')
	.action((arg_collection, option) => {

        let collection_file;
        const collection_file_path = `${arg_collection}.json`

        try {
            collection_file = readFileSync(collection_file_path);
        } catch (e) {}

        const state_file = readFileSync('state.json');
        const json_state = JSON.parse(state_file);
        json_state.active_collection = arg_collection;

        if (collection_file){
            writeFileSync('state.json', JSON.stringify(json_state));
            return;
        }

        if (Object.keys(option).length > 0 ) {
            writeFileSync(collection_file_path, JSON.stringify([]));
            writeFileSync('state.json', JSON.stringify(json_state));
            return;
        }

        console.log('Collection not found. Use -n option to create new collection.')
        
    });

let active_collection_file;

try {
	const state_file = readFileSync('state.json');
	const json_state = JSON.parse(state_file);
	const active_collection = json_state.active_collection;
	active_collection_file = `${active_collection}.json`;
} catch (e) {
	console.log('catch');

	const active_collection = 'default_collection';
	active_collection_file = `${active_collection}.json`;

	const state_json = { active_collection };
	writeFileSync('state.json', JSON.stringify(state_json));

	json = JSON.stringify([]);
	writeFileSync(active_collection_file, json);
}

cli.parse();
