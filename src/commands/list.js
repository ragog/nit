import { readFileSync } from 'fs';

export const registerCommandList = (cli, active_collection) => {
	const active_collection_file = `${active_collection}.json`;

	cli
		.command('l')
		.description('list notes')
		.option('-c <collection>')
		.action((arg_collection) => {
			let collection_file = active_collection_file;
			let collection_name = active_collection;
			let file;

			if (Object.keys(arg_collection).length > 0) {
				collection_name = arg_collection.c;
				collection_file = `${collection_name}.json`;
			}

			try {
				file = readFileSync(collection_file);
			} catch (e) {
				throw new Error(`No collection ${collection_name} found`);
			}

			const json = JSON.parse(file);

			if (json.length > 0) {
				if (collection_name) {
					console.log(`Notes in collection ${collection_name}:`);
				} else {
					console.log(`Notes in active collection ${collection_name}:`);
				}

				json.forEach((note) => {
					console.log(`${note.arg_title} (${new Date(note.timestamp).toISOString()})`);
				});
				return;
			}

			console.log(`No notes founds in ${collection_name}`);
		});
};
