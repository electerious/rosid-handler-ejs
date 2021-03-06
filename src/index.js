'use strict'

const fs = require('fs').promises
const locate = require('./locate')
const ejs = require('./ejs')
const data = require('./data')

/**
 * Load EJS and transform to HTML.
 * @public
 * @param {String} filePath - Absolute path to file.
 * @param {?Object} opts - Options.
 * @returns {Promise<String>} HTML.
 */
module.exports = async function(filePath, opts = {}) {

	if (typeof filePath !== 'string') throw new Error(`'filePath' must be a string`)
	if (typeof opts !== 'object') throw new Error(`'opts' must be undefined or an object`)

	const dataPath = await locate(filePath)
	const json = await data(dataPath, opts)
	const str = await fs.readFile(filePath, 'utf8')

	return ejs(filePath, str, json)

}

/**
 * Tell Rosid with which file extension it should load the file.
 * @public
 * @param {?Object} opts - Options.
 * @returns {String} File extension.
 */
module.exports.in = function(opts = {}) {

	return opts.in == null ? '.ejs' : opts.in

}

/**
 * Tell Rosid with which file extension it should save the file.
 * @public
 * @param {?Object} opts - Options.
 * @returns {String} File extension.
 */
module.exports.out = function(opts = {}) {

	return opts.out == null ? '.html' : opts.out

}

/**
 * Attach an array to the function, which contains a list of
 * file patterns used by the handler. The array will be used by Rosid for caching purposes.
 * @public
 */
module.exports.cache = [
	'**/*.ejs',
	'**/*.js',
	'**/*.json'
]