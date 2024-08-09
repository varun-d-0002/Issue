interface IPagination {
	perPage: number | string //per page
	page: number | string //page
	sort: 'asc' | 'desc' //asc | desc | undefined, default - asc
	sortKey: string //sort key
}

interface managerSessionDataType {
	id: number
	role: number
	expires: number
}

interface imageUpdateType {
	originalName: string
	showOrder: number
}
