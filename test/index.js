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

	it('should return an error when called with an invalid filePath', function(done) {

		index(null, '/src', '/dist', null, (err, str, savePath) => {

			assert.isNotNull(err)

			done()

		})

	})

	it('should return an error when called with a fictive filePath', function(done) {

		index('test.scss', '/src', '/dist', null, (err, str, savePath) => {

			assert.isNotNull(err)

			done()

		})

	})

	it('should load EJS and transform it to HTML when everything specified', function(done) {

		index(file.path, '/src', '/dist', null, (err, str, savePath) => {

			assert.isNull(err)
			assert.isString(savePath)
			assert.strictEqual(str, '')
			assert.strictEqual(savePath.substr(-5), '.html')

			done()

		})

	})

	it('should load EJS and transform it to EJS when distPath not specified', function(done) {

		index(file.path, '/src', null, null, (err, str, savePath) => {

			assert.isNull(err)
			assert.isString(savePath)
			assert.strictEqual(str, '')
			assert.strictEqual(savePath.substr(-5), '.html')

			done()

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