'use strict'

const assert = require('chai').assert
const ejs    = require('./../src/ejs')

describe('ejs()', function() {

	it('should return an empty string when called without parameters', function() {

		return ejs(null, null, null).then((result) => {

			assert.strictEqual(result, '')

		})

	})

	it('should return an empty string when called with an empty EJS string', function() {

		const input = ``

		return ejs(null, input, null).then((result) => {

			assert.strictEqual(result, '')

		})

	})

	it('should return an error when called with incorrect EJS', function() {

		const input = `<%= test %>`

		return ejs(null, input, null).then((result) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should return HTML when called with valid EJS', function() {

		const input = `<%= test %>`
		const data  = { test: 42 }

		return ejs(null, input, data).then((result) => {

			assert.isString(result)
			assert.include(result, data.test)

		})

	})

	it('should return HTML when called with valid EJS, but without data', function() {

		const input = `test`

		return ejs(null, input, null).then((result) => {

			assert.isString(result)
			assert.include(result, input)

		})

	})

})