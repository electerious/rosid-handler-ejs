'use strict'

const path   = require('path')
const fs     = require('fs')
const rename = require('rename-extension')
const async  = require('async')
const ejs    = require('./ejs')

/*
 * Read and parse a JSON-file.
 * @param {string} filePath - Path to a valid JSON file.
 * @returns {object} JSON
 */
const readJson = function(filePath) {

	const data = fs.readFileSync(filePath)

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

	filePath = rename(filePath, 'ejs')

	const savePath     = rename(filePath.replace(srcPath, distPath), 'html')
	const dataPath     = path.join(process.cwd(), 'data.json')
	const relativePath = path.relative(srcPath, filePath)

	const current     = path.parse(relativePath)
	const environment = process.env
	const dataJSON    = readJson(dataPath)
	const globalData  = dataJSON['*'] || {}
	const pageData    = dataJSON[current.name] || {}

	const data = Object.assign({}, globalData, pageData, {
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

/**
 * Attach an array to the function, which contains a list of
 * extensions used by the handler. The array will be used by Rosid for caching purposes.
 */
module.exports.cache = [
	'.ejs',
	'.json'
]