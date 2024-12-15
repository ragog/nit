import { jest } from '@jest/globals'; // Explicit import of Jest globals
import { createCli } from '../app.js'; // Replace with the actual file name
import * as fs from 'fs';
import mockFs from 'mock-fs';

describe('CLI Tests', () => {
	let cli;
	let consoleSpy;

	beforeEach(() => {
		// Mock the filesystem
		mockFs({
			'default_collection.json': JSON.stringify([]),
			'state.json': JSON.stringify({ active_collection: 'default_collection' }),
		});

		// Mock console.log
		consoleSpy = jest.spyOn(console, 'log').mockImplementation();

		// Initialize CLI
		cli = createCli();
	});

	afterEach(() => {
		// Restore the filesystem and console
		mockFs.restore();
		consoleSpy.mockRestore();
	});

	test('should write a note', async () => {
		await cli.parseAsync(['node', 'script', 'w', 'TestTitle', 'TestBody']);

		const data = JSON.parse(fs.readFileSync('default_collection.json', 'utf8'));
		expect(data).toHaveLength(1);
		expect(data[0]).toMatchObject({ arg_title: 'TestTitle', arg_body: 'TestBody' });

		expect(consoleSpy).toHaveBeenCalledWith("Writing note titled 'TestTitle'");
	});

	test('should read a note', async () => {
		// Prepopulate a note
		const notes = [{ arg_title: 'TestTitle', arg_body: 'TestBody', timestamp: Date.now() }];
		fs.writeFileSync('default_collection.json', JSON.stringify(notes));

		await cli.parseAsync(['node', 'script', 'r', 'TestTitle']);

		expect(consoleSpy).toHaveBeenCalledWith('TestBody');
	});

	test('should list all notes in active collection', async () => {
		// Prepopulate notes
		const notes = [
			{ arg_title: 'Note1', arg_body: 'Body1', timestamp: Date.now() },
			{ arg_title: 'Note2', arg_body: 'Body2', timestamp: Date.now() },
		];
		fs.writeFileSync('default_collection.json', JSON.stringify(notes));

		await cli.parseAsync(['node', 'script', 'l']);

		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Notes in collection default_collection:'));
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Note1'));
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Note2'));
	});

	test('should list all notes in secondary collection', async () => {
		// Prepopulate notes
		const notes = [
			{ arg_title: 'Note1', arg_body: 'Body1', timestamp: Date.now() },
			{ arg_title: 'Note2', arg_body: 'Body2', timestamp: Date.now() },
		];
		fs.writeFileSync('secondary_collection.json', JSON.stringify(notes));

		await cli.parseAsync(['node', 'script', 'l', '-c', 'secondary_collection']);

		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Notes in collection secondary_collection:'));
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Note1'));
		expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Note2'));
	});

	test('should switch to an existing collection', async () => {
		fs.writeFileSync('new_collection.json', JSON.stringify([]));

		await cli.parseAsync(['node', 'script', 'c', 'new_collection']);

		const state = JSON.parse(fs.readFileSync('state.json', 'utf8'));
		expect(state.active_collection).toBe('new_collection');
	});

	test('should create and switch to a new collection', async () => {
		await cli.parseAsync(['node', 'script', 'c', 'new_collection', '--new']);

		const state = JSON.parse(fs.readFileSync('state.json', 'utf8'));
		expect(state.active_collection).toBe('new_collection');

		const newCollectionExists = fs.existsSync('new_collection.json');
		expect(newCollectionExists).toBe(true);
	});

	test('should handle missing collection without --new option', async () => {
		await cli.parseAsync(['node', 'script', 'c', 'missing_collection']);

		expect(consoleSpy).toHaveBeenCalledWith('Collection not found. Use -n option to create new collection.');
	});

	test('should return version', async () => {
		await cli.parseAsync(['node', 'script', '-v']);

		expect(consoleSpy).toHaveBeenCalledWith('1.0.0');
	});
});
