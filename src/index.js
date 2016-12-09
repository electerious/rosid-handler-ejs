'use strict'

const path      = require('path')
const fs        = require('fs')
const denodeify = require('denodeify')
const rename    = require('rename-extension')
const ejs       = require('./ejs')

/*
 * Load EJS and transform to HTML.
 * @public
 * @param {String} filePath - Absolute path to the requested file.
 * @param {String} srcPath - Absolute path to the source folder.
 * @param {String} distPath - Absolute path to the export folder.
 * @param {Object} route - The route which matched the request URL.
 * @returns {Promise} Returns the following properties if resolved: {Object}.
 */
module.exports = function(filePath, srcPath, distPath, route) {

	let savePath     = null
	let dataPath     = null
	let relativePath = null

	const fileExt = (route.args && route.args.fileExt) || 'ejs'
	const saveExt = (route.args && route.args.saveExt) || 'html'

	let data = null

	return Promise.resolve().then(() => {

		// Prepare file paths

		filePath     = rename(filePath, fileExt)
		savePath     = rename(filePath.replace(srcPath, distPath), saveExt)
		dataPath     = path.resolve(process.cwd(), './data.json')
		relativePath = path.relative(srcPath, filePath)

	}).then(() => {

		// Get the contents of the ejs data

		return denodeify(fs.readFile)(dataPath, 'utf8')

	}).then((dataStr) => {

		// Process ejs data

		const current     = path.parse(relativePath)
		const environment = distPath==null ? 'dev' : 'prod'

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

		return {
			data     : str,
			savePath : savePath
		}

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