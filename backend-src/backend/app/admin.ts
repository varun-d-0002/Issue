// import type { IAdmin } from '../types/app/admin'

export const Admin: IAdmin = {
	login: async function (arg, methods) {
		const isValidParam = methods.validateParams(arg)
		if (!isValidParam) throw methods.authError('Invalid parameters')

		const manager = await methods.findManager(arg.username)
		if (manager === null) throw methods.authError('Invalid username')

		const isPwMatch = await methods.authenticateManager(arg.password, manager.pwhash)
		if (!isPwMatch) throw methods.authError('Invalid password')

		methods.setupSession(manager)

		return {
			managerId: manager.managerId
		}
	},

	getAuthenticatedAdmin: async function (arg, methods) {
		if (arg.managerId === undefined) throw methods.sessionError('Invalid manager')

		const manager = await methods.getManager(arg.managerId)
		if (manager == null) throw methods.sessionError(`manager ${arg.managerId} not found`)

		return {
			auth: manager.authLevel,
			username: manager.username
		}
	}
}
