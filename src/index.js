'use strict'

const path      = require('path')
const fs        = require('fs')
const denodeify = require('denodeify')
const ejs       = require('./ejs')

/*
 * Load EJS and transform to HTML.
 * @public
 * @param {String} filePath - Absolute path to file.
 * @param {?Object} opts - Options.
 * @returns {Promise} Returns the following properties if resolved: {String}.
 */
module.exports = function(filePath, opts) {

	let dataPath = null
	let data = null

	return Promise.resolve().then(() => {

		if (typeof filePath!=='string')           throw new Error(`'filePath' must be a string`)
		if (typeof opts!=='object' && opts!=null) throw new Error(`'opts' must be undefined, null or an object`)

	}).then(() => {

		// Prepare file path
		dataPath = path.resolve(process.cwd(), './data.json')

	}).then(() => {

		// Get the contents of the ejs data
		return denodeify(fs.readFile)(dataPath, 'utf8')

	}).then((dataStr) => {

		// Process ejs data

		const current     = path.parse(filePath)
		const environment = (opts!=null && opts.optimize===true) ? 'prod' : 'dev'

		const dataJSON   = JSON.parse(dataStr)
		const globalData = dataJSON['*'] || {}
		const pageData   = dataJSON[current.name] || {}

		data = Object.assign({}, globalData, pageData, {
			current,
			environment
		})

	}).then(() => {

		// Get the contents of the file
		return denodeify(fs.readFile)(filePath, 'utf8')

	}).then((str) => {

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
 */
module.exports.in = function(opts) {

	return (opts!=null && opts.in!=null) ? opts.in : 'ejs'

}

/**
 * Tell Rosid with which file extension it should save the file.
 * @public
 * @param {?Object} opts - Options.
 */
module.exports.out = function(opts) {

	return (opts!=null && opts.out!=null) ? opts.out : 'html'

}

/**
 * Attach an array to the function, which contains a list of
 * extensions used by the handler. The array will be used by Rosid for caching purposes.
 * @public
 */
module.exports.cache = [
	'.js',
	'.json'
]