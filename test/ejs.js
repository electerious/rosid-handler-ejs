'use strict'

const assert = require('chai').assert
const ejs = require('./../src/ejs')

describe('ejs()', function() {

	it('should return an empty string when called without parameters', async function() {

		const result = await ejs(null, null, null)

		assert.strictEqual(result, '')

	})

	it('should return an empty string when called with an empty EJS string', async function() {

		const input = ``
		const result = await ejs(null, input, null)

		assert.strictEqual(result, input)

	})

	it('should return an error when called with incorrect EJS', async function() {

		const input = `<%= test %>`

		return ejs(null, input, null).then((result) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return HTML when called with valid EJS', async function() {

		const input = `<%= test %>`
		const data  = { test: 42 }
		const result = await ejs(null, input, data)

		assert.isString(result)
		assert.include(result, data.test)

	})

	it('should return HTML when called with valid EJS, but without data', async function() {

		const input = `test`
		const result = await ejs(null, input, null)

		assert.isString(result)
		assert.include(result, input)

	})

})