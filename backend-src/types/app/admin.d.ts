type authenticationParam = {
	username: string
	password: string
}
interface IAdmin {
	login: (
		params: authenticationParam,
		methods: {
			validateParams: (params: authenticationParam) => authenticationParam | null
			findManager: (username: string, transaction?: any) => Promise<{ managerId: number; pwhash: string } | null>
			authenticateManager: (password: string, pwhash: string) => Promise<boolean>
			setupSession: (params: { managerId: number }) => void
			authError: (message: string) => Error
		}
	) => Promise<{ managerId: number } | never>

	getAuthenticatedAdmin: (
		params: { managerId?: number },
		methods: {
			getManager: (managerId: number) => Promise<{ authLevel: IAuth; username: string } | null>
			sessionError: (message: string) => Error
		}
	) => Promise<{
		auth: string
		username: string
	}>
}
