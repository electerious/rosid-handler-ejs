'use strict'

const path = require('path')
const requireData = require('require-data')
const continuousStealthyRequire = require('continuous-stealthy-require')

/**
 * Loads and parses data.
 * @public
 * @param {String} dataPath - Path to the data JSON.
 * @param {?Object} opts - Options.
 * @returns {Promise<Object>} Data.
 */
module.exports = async function(dataPath, opts) {

	const environment = (opts != null && opts.optimize === true) ? 'prod' : 'dev'

	const defaultData = {}

	const globalData = (async () => {

		const hasData = opts != null && opts.data != null
		if (hasData === false) return {}

		const mustRequire = typeof opts.data === 'string'
		if (mustRequire === true) return requireData(path.resolve(opts.data), continuousStealthyRequire)

		return opts.data

	})()

	const localData = (async () => {

		const hasData = dataPath != null
		if (hasData === false) return {}

		return requireData(dataPath, continuousStealthyRequire)

	})()

	const additionalData = {
		environment
	}

	return Object.assign(
		defaultData,
		await globalData,
		await localData,
		additionalData
	)

}