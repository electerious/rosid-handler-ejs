'use strict'

const ejs = require('ejs')

/**
 * Transform EJS to HTML.
 * @public
 * @param {?String} filePath - Path to the EJS file being rendered.
 * @param {?String} str - Contents of a EJS file.
 * @param {?Object} data - EJS data used to render the file.
 * @returns {Promise} Returns the following properties if resolved: {String}.
 */
module.exports = function(filePath, str, data) {

	return new Promise((resolve, reject) => {

		// Do nothing when called with an empty string
		if (str==null || str==='') return resolve('')

		// Render EJS
		const result = ejs.render(str, data, { filename: filePath })

		resolve(result)

	})

}