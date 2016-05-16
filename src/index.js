'use strict'

const path      = require('path')
const fs        = require('fs')
const denodeify = require('denodeify')
const rename    = require('rename-extension')
const ejs       = require('./ejs')

/*
 * Load EJS and transform to HTML.
 * @public
 * @param {string} filePath - Absolute path to the requested file.
 * @param {string} srcPath - Absolute path to the source folder.
 * @param {string} distPath - Absolute path to the export folder.
 * @param {Object} route - The route which matched the request URL.
 * @param {function} next - The callback that handles the response. Receives the following properties: err, result, savePath.
 */
module.exports = function(filePath, srcPath, distPath, route, next) {

	let savePath     = null
	let dataPath     = null
	let relativePath = null

	let data = null

	Promise.resolve()

	// Prepare file paths
	.then(() => {

		filePath     = rename(filePath, 'ejs')
		savePath     = rename(filePath.replace(srcPath, distPath), 'html')
		dataPath     = path.resolve(process.cwd(), './data.json')
		relativePath = path.relative(srcPath, filePath)

	})

	// Get the contents of the ejs data
	.then(() => denodeify(fs.readFile)(dataPath, 'utf8'))

	// Process ejs data
	.then((dataStr) => {

		const current     = path.parse(relativePath)
		const environment = process.env

		const dataJSON    = JSON.parse(dataStr)
		const globalData  = dataJSON['*'] || {}
		const pageData    = dataJSON[current.name] || {}

		data = Object.assign({}, globalData, pageData, {
			current,
			environment
		})

	})

	// Get the contents of the file
	.then(() => denodeify(fs.readFile)(filePath, 'utf8'))

	// Process file
	.then((str) => ejs(filePath, str, data))

	// Return processed data and catch errors
	// Avoid .catch as we don't want to catch errors of the callback
	.then(
		(str) => next(null, str, savePath),
		(err) => next(err, null, null)
	)

}

/**
 * Attach an array to the function, which contains a list of
 * extensions used by the handler. The array will be used by Rosid for caching purposes.
 */
module.exports.cache = [
	'.ejs',
	'.json'
]