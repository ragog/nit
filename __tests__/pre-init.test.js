import { jest } from '@jest/globals'; // Explicit import of Jest globals
import { createCli } from '../src/app.js'; // Replace with the actual file name
import * as fs from 'fs';
import mockFs from 'mock-fs';

describe('CLI Tests, assuming uninitialized status', () => {
	let cli;
	let consoleSpy;

	beforeEach(() => {
		// Mock the empty filesystem
		mockFs({});

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

});
