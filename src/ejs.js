'use strict'

const ejs = require('ejs')

/*
 * Transform EJS to HTML.
 * @public
 * @param {?String} filePath - Path to the EJS file being rendered.
 * @param {?String} str - Contents of a EJS file.
 * @param {?Object} data - EJS data used to render the file.
 */
module.exports = function(filePath, str, data) {

	// Do nothing when called with an empty string
	if (str==null || str==='') return Promise.resolve('')

	return new Promise((resolve, reject) => {

		resolve(ejs.render(str, data, {
			filename: filePath
		}))

	})

}