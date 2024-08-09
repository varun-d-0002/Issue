// type createMemberParams = {
// 	lineProfile: lineProfile
// 	firstName: string
// 	firstNameKana: string
// 	lastName: string
// 	lastNameKana: string
// 	telephone: string
// }

type searchMemberParams = {
	isFriends?: string
	name?: string
	address?: string
	dateOfBirthMin?: string
	dateOfBirthMax?: string
	occupation?: string
	lastVisitMin?: string
	lastVisitMax?: string
	countVisitMin?: string
	countVisitMax?: string
	memberSinceMin?: string
	memberSinceMax?: string
	telephone?: string
	gender?: string
	activeMin?: string
	activeMax?: string
	remarks?: string
	serviceTypes?: string[]
	serviceAreas?: string[]
}
type createMemberParams = {
	lineId: string
	picUrl: string | null
	displayName: string
	firstName: string
	firstNameKana: string
	lastName: string
	lastNameKana: string
	gender: 'male' | 'female'
	dateOfBirth: string
	postalCode: string
	telephone: string
	prefecture: string
	city: string
	address: string
	building: string
	serviceAreas: string[]
	serviceTypes: string[]
}
// interface IMember {
// 	registerPersonalInfo: (
// 		arg: Partial<createMemberParams>,
// 		methods: {
// 			registerMember: (arg: {
// 				lineId: lineProfile['userId']
// 				picUrl: lineProfile['pictureUrl']
// 				displayName: lineProfile['displayName']
// 				firstName: string
// 				firstNameKana: string
// 				lastName: string
// 				lastNameKana: string
// 				telephone: string
// 			}) => Promise<{
// 				memberId: number
// 			}>
// 		}
// 	) => Promise<{
// 		memberId: number
// 	}>
// 	// updatePersonalInfo: (arg: {}, methods: {}, errorCb: {}) => Promise<void>
// 	// getPersonalInfo: (arg: {}, methods: {}, errorCb: {}) => Promise<void>
// }
