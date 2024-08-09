import 'dotenv/config'
import { log, warn } from 'console'
import { db, getSequelize } from '../../infra/models'
import dbSync from './migrations/sync'
import dbForceSync from './migrations/force'
import seedManager from './seeds/manager'

const tryMigration = async (migration: CallableFunction, database: any, testCase: string) => {
	try {
		await migration(database)
		log(testCase + ' complete')
	} catch (e) {
		warn(testCase + ' failed ' + (e as Error).message)
	}
}
const main = async () => {
	let initArgument = process.argv.find((arg) => arg.startsWith('init:')) ?? ''
	if (initArgument) initArgument = initArgument.replace('init:', '')
	const initMigrations = initArgument.split(',').filter((arg) => arg)
	if (initMigrations.length === 0) {
		throw new Error(
			'Invalid or missing "init:" arguments. Possible arguments are:\nsync -synchronizes db.\nforce -synchronizes db by dropping tables first.\nmanager - seeds manager.'
		)
	}
	log('initArgument', initArgument, 'initMigrations', initMigrations)
	const sequelize = getSequelize()
	await sequelize.authenticate()

	for await (const migration of initMigrations) {
		switch (migration) {
			case 'sync':
				await tryMigration(dbSync, sequelize, 'dbSync')
				break
			case 'force':
				await tryMigration(dbForceSync, sequelize, 'dbForceSync')
				break
			case 'manager':
				await tryMigration(seedManager, db, 'init manager')
				break
			default:
				break
		}
	}
}
main()
	// eslint-disable-next-line promise/always-return
	.then(() => {
		log('db script finished', 'info')
		process.exit(0)
	})
	.catch((e) => {
		log({ msg: 'script error', err: e })
	})
