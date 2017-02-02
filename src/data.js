'use strict'

const path = require('path')

/*
 * Loads and parses data for EJS.
 * @public
 * @param {String} dataPath - Path to the data JSON.
 * @param {String} filePath - Path to the EJS file being rendered.
 * @param {?Object} opts - Options.
 */
module.exports = function(dataPath, filePath, opts) {

	return new Promise((resolve, reject) => {

		const current     = path.parse(filePath)
		const environment = (opts!=null && opts.optimize===true) ? 'prod' : 'dev'

		const dataJSON   = require(dataPath)
		const globalData = dataJSON['*'] || {}
		const pageData   = dataJSON[current.name] || {}

		resolve(Object.assign({}, globalData, pageData, {
			current,
			environment
		}))

	})

}