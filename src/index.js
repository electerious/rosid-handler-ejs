'use strict'

const path       = require('path')
const fs         = require('fs')
const locatePath = require('locate-path')
const pify       = require('pify')
const ejs        = require('./ejs')
const data       = require('./data')

/**
 * Load EJS and transform to HTML.
 * @public
 * @param {String} filePath - Absolute path to file.
 * @param {?Object} opts - Options.
 * @returns {Promise} Returns the following properties if resolved: {String}.
 */
module.exports = function(filePath, opts) {

	return Promise.resolve().then(() => {

		if (typeof filePath!=='string')           throw new Error(`'filePath' must be a string`)
		if (typeof opts!=='object' && opts!=null) throw new Error(`'opts' must be undefined, null or an object`)

	}).then(() => {

		const fileDir  = path.dirname(filePath)
		const fileName = path.parse(filePath).name

		// Look for the data in the same directory as filePath
		const locateDataPath = locatePath([
			`${ fileName }.data.js`,
			`${ fileName }.data.json`
		], {
			cwd: fileDir
		})

		// Convert dataPath path to an absolute path
		return locateDataPath.then((dataPath) => {

			return dataPath==null ? null : path.join(fileDir, dataPath)

		})

	}).then((dataPath) => {

		// Get the data for ejs
		return data(dataPath, opts)

	}).then((data) => {

		// Get the contents of the file and pass both data and str to next promise
		return pify(fs.readFile)(filePath, 'utf8').then((str) => ({
			str,
			data
		}))

	}).then(({ str, data }) => {

		// Process file
		return ejs(filePath, str, data)

	}).then((str) => {

		return str

	})

}

/**
 * Tell Rosid with which file extension it should load the file.
 * @public
 * @param {?Object} opts - Options.
 * @returns {String} File extension.
 */
module.exports.in = function(opts) {

	return (opts!=null && opts.in!=null) ? opts.in : '.ejs'

}

/**
 * Tell Rosid with which file extension it should save the file.
 * @public
 * @param {?Object} opts - Options.
 * @returns {String} File extension.
 */
module.exports.out = function(opts) {

	return (opts!=null && opts.out!=null) ? opts.out : '.html'

}

/**
 * Attach an array to the function, which contains a list of
 * extensions used by the handler. The array will be used by Rosid for caching purposes.
 * @public
 */
module.exports.cache = [
	'.ejs',
	'.json',
	'.js'
]