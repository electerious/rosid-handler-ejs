'use strict'

const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const temp   = require('temp').track()
const index  = require('./../src/index')

let file = null
let data = null

describe('index()', function() {

	before(function() {

		file = temp.openSync({
			suffix: '.ejs'
		})

		data = {
			path: path.resolve(process.cwd(), './data.json')
		}

		fs.writeFileSync(data.path, '{}')

	})

	it('should return an error when called with an invalid filePath', function() {

		return index(null, '/src', '/dist', null).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should return an error when called with a fictive filePath', function() {

		return index('test.scss', '/src', '/dist', null).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should load EJS and transform it to HTML when everything specified', function() {

		return index(file.path, '/src', '/dist', null).then(({ data, savePath }) => {

			assert.isString(savePath)
			assert.strictEqual(data, '')
			assert.strictEqual(savePath.substr(-5), '.html')

		})

	})

	it('should load EJS and transform it to EJS when distPath not specified', function() {

		return index(file.path, '/src', null, null).then(({ data, savePath }) => {

			assert.isString(savePath)
			assert.strictEqual(data, '')
			assert.strictEqual(savePath.substr(-5), '.html')

		})

	})

	describe('.cache', function() {

		it('should be an array', function() {

			assert.isArray(index.cache)

		})

	})

	after(function() {

		fs.unlinkSync(data.path)

	})

})