'use strict'

let path  = require('path')
let fs    = require('fs')
let async = require('async')
let ejs   = require('./lib/ejs')

/*
 * Rename the extension of a file in a path.
 * @param {string} filePath - Path to a file.
 * @param {string} fileExt - New extension of the file.
 * @returns {string} filePath - Path ending with the new fileExt.
 */
const renameExtension = function(filePath, fileExt) {

	let parsedPath = path.parse(filePath)

	return parsedPath.dir + path.sep + parsedPath.name + '.' + fileExt

}

/*
 * Read and parse a JSON-file.
 * @param {string} filePath - Path to a valid JSON file.
 * @returns {object} JSON
 */
const readJson = function(filePath) {

	let data = fs.readFileSync(filePath)

	return JSON.parse(data)

}

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

	filePath = renameExtension(filePath, 'ejs')

	let savePath     = renameExtension(filePath.replace(srcPath, distPath), 'html')
	let dataPath     = path.join(process.cwd(), 'data.json')
	let relativePath = path.relative(srcPath, filePath)

	let current     = path.parse(relativePath)
	let environment = process.env
	let dataJSON    = readJson(dataPath)
	let globalData  = dataJSON['*'] || {}
	let pageData    = dataJSON[current.name] || {}

	let data = Object.assign({}, globalData, pageData, {
		current,
		environment
	})

	async.waterfall([

		(next)      => fs.readFile(filePath, 'utf8', next),
		(str, next) => ejs(filePath, str, data, next)

	], (err, str) => {

		if (err!=null) {
			next(err, null, null)
			return false
		}

		next(null, str, savePath)

	})

}