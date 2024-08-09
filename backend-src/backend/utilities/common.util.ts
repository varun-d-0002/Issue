function areArraysEqual<T>(a: T[], b: T[]) {
	return a.length === b.length && [...a].every((value) => b.includes(value))
}
function clampNumber(value: number | string, min = 0, max = 100) {
	value = isNaN(value as number) ? parseInt(value as string) : 20
	return value < min ? min : value > max ? max : value
}
function divideString(text: string, maxLength: number) {
	if (maxLength < 1) return [text]
	if (text.length <= maxLength) return [text]
	const result = []
	let startIndex = 0
	while (startIndex < text.length) {
		const segment = text.substring(startIndex, startIndex + maxLength)
		result.push(segment)
		startIndex += maxLength
	}
	return result
}
/**
 * Divide an array into multiple subarrays, each of which is at most of the given length.
 * If maxLength is less than 1, return the original array.
 * If the array is already shorter than or equal to maxLength, return a single-element array containing the array.
 * @param collection The array to divide
 * @param maxLength The maximum length of each subarray.
 * @returns An array of subarrays. The length of the returned array is always <= Math.ceil(collection.length / maxLength).
 */
function divideArray<T>(collection: T[], maxLength: number) {
	if (maxLength < 1) return [collection]
	if (collection.length <= maxLength) return [collection]
	const result = []
	let startIndex = 0
	while (startIndex < collection.length) {
		const segment = collection.slice(startIndex, startIndex + maxLength)
		result.push(segment)
		startIndex += maxLength
	}
	return result
}
async function segmentizeOperation<T, U>(collection: T[], cb: (arg: T[]) => Promise<U>, batchSize = 50) {
	const operations = []
	for (let i = 0; i < collection.length; i += batchSize) {
		const batch = collection.slice(i, i + batchSize)
		operations.push(cb(batch))
	}
	return await Promise.allSettled(operations)
}
function randomSample([...arr], n = 1) {
	let m = arr.length
	while (m) {
		const i = Math.floor(Math.random() * m--)
		// eslint-disable-next-line security/detect-object-injection
		;[arr[m], arr[i]] = [arr[i], arr[m]]
	}
	return arr.slice(0, n)
}

export default {
	areArraysEqual,
	clampNumber,
	segmentizeOperation,
	divideString,
	randomSample,
	divideArray
}
