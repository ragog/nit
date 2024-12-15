import { readFileSync } from 'fs';

export const registerCommandRead = (cli, active_collection) => {
	const active_collection_file = `${active_collection}.json`;

	cli
		.command('r')
		.description('read note')
		.argument('<title>', 'title of note')
		.action((arg_title) => {
			const file = readFileSync(active_collection_file);
			const json = JSON.parse(file);
			const note_array = json.filter((element) => element.arg_title === arg_title);

			if (note_array.length > 1) {
				console.log('There are multiple notes with that title:');
				note_array.forEach((note) => {
					console.log(`${note.arg_body} (${new Date(note.timestamp).toISOString()})`);
				});
				return;
			}

			if (note_array.length === 1) {
				console.log(`${note_array[0].arg_body}`);
				return;
			}

			console.log(`No such note found in collection ${active_collection_file}`);
		});
};
