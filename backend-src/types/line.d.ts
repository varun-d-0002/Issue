interface richmenuPattern {
	size: {
		width: number
		height: number
	}
	selected: boolean
	name: string //Max: 300
	chatBarText: string
	areas: Array<{
		bounds: {
			x: number
			y: number
			width: number
			height: number
		}
		action: any
		// Action<{
		// 	label?: string
		// }>
	}>
}

interface lineProfile {
	userId: string
	displayName: string
	pictureUrl: string | null
	statusMessage: string | null
}
interface IAudienceSearch {
	address?: string
	memberSinceMin?: string
	memberSinceMax?: string
}

type IAudienceCreate = IAudienceSearch & {
	audienceName: string
}
