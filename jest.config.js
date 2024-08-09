/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['/node_modules/'],
	coverageDirectory: './backend-src/backend/tests/coverage',
	setupFiles: ['./backend-src/backend/tests/setEnvVars.ts'],
	verbose: true,
	detectOpenHandles: true
}
