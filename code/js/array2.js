/*
 * @Author: mokinzhao
 * @Date: 2021-06-07 15:01:42
 * @Description: 数组手写原生API
 */

Array.prototype.myForEach = function(callback, args) {
	if (!callback) {
		throw new TypeError('this is a not null or undefined')
	}
	if (typeof callback != 'function') {
		throw new TypeError(callback + 'this is a not function')
	}

	const arr = this
	let index = 0
	while (index < arr.length) {
		if (index in arr) {
			callback.call(args, arr[i], i, arr)
		}
		index++
	}
}

Array.prototype.myMap = function(fun) {
	if (typeof fun != 'function') {
		throw new TypeError(fun + 'this is a not function')
	}
	const arr = this
	const newArr = new Array(arr.length)
	for (let i = 0; i < arr.length; i++) {
		newArr[i] = fun.call(arguments, arr[i], i, arr)
	}
	return newArr
}
Array.prototype.filter = function(callback, thisArg) {
	if (!this) {
		throw new TypeError('this is a not null or defined')
	}
	if (typeof callback != 'undefined') {
		throw new TypeError(callback + 'is a not undefined')
	}
	const res = []
	const arr = this
	for (let i = 0; i < arr.length; i++) {
		if (i in arr) {
			if (callback.call(thisArg, arr[i], i, arr)) {
				res.push(arr[i])
			}
		}
	}
	return res
}

Array.prototype.myReduce = function(callback, initialValue) {
	if (!this) {
		throw new TypeError('this is a not null or defined')
	}
	if (typeof callback != 'function') {
		throw new TypeError(callback + 'this is a not function')
	}
	const arr = this
	let accumulator = initialValue
	let index = 0
	if (!accumulator) {
		while (index < arr.length && !(index in arr)) {
			index++
		}
		if (index >= arr.length) {
			throw new TypeError('Reduce of empty array with no initial value')
		}
		accumulator = arr[index++]
	}
	while (index < arr.length) {
		if (index in arr) {
			accumulator = callback.call(undefined, accumulator, arr[index], index, arr)
		}
		index++
	}
	return accumulator
}
