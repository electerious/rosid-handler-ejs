'use strict'

const path    = require('path')
const decache = require('decache')

/**
 * Requires a fresh, uncached module.
 * @param {String} filePath - File to require.
 * @returns {*} Required module.
 */
const requireUncached = function(filePath) {

	// Force a fresh require by removing module from cache,
	// including all of its child modules.
	decache(filePath)

	return require(filePath)

}

/**
 * Loads and parses data for EJS.
 * @public
 * @param {String} dataPath - Path to the data JSON.
 * @param {?Object} opts - Options.
 * @returns {Promise} Returns the following properties if resolved: {Object}.
 */
module.exports = function(dataPath, opts) {

	return new Promise((resolve, reject) => {

		const environment = (opts!=null && opts.optimize===true) ? 'prod' : 'dev'

		const globalData = (() => {

			const hasData = opts!=null && opts.data!=null
			if (hasData===false) return {}

			const mustRequire = typeof opts.data==='string'
			if (mustRequire===true) return requireUncached(path.resolve(opts.data))

			return opts.data

		})()

		const localData = (() => {

			const hasData = dataPath!=null
			if (hasData===false) return {}

			return requireUncached(dataPath)

		})()

		resolve(Object.assign({}, globalData, localData, {
			environment
		}))

	})

}