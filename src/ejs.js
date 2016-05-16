'use strict'

const ejs = require('ejs')

/*
 * Transform EJS to HTML.
 * @public
 * @param {string} filePath - Path to the EJS file.
 * @param {string} str - EJS.
 * @param {function} next - The callback that handles the response. Receives the following properties: err, html.
 */
module.exports = function(filePath, str, data, next) {

	try {

		const result = ejs.render(str, data, {
			filename: filePath
		})

		next(null, result)

	} catch (err) {

		next(err, null)

	}

}