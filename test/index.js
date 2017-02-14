'use strict'

const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const temp   = require('temp').track()
const index  = require('./../src/index')

const newFile = function(content, suffix) {

	const file = temp.openSync({ suffix })

	fs.writeFileSync(file.path, content)

	return file.path

}

const dataPath = path.resolve(process.cwd(), './data.json')

describe('index()', function() {

	before(function() {

		fs.writeFileSync(dataPath, '{}')

	})

	it('should return an error when called without a filePath', function() {

		return index().then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when called with invalid options', function() {

		const file = newFile('', '.ejs')

		return index(file, '').then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when called with a fictive filePath', function() {

		return index('test.scss').then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when called with invalid EJS', function() {

		const file = newFile('<% + %>', '.ejs')

		return index(file).then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should load EJS and transform it to HTML', function() {

		const file = newFile('<%= environment %>', '.ejs')

		return index(file).then((data) => {

			assert.strictEqual(data, 'dev')

		})

	})

	it('should load EJS and transform it to optimized HTML when optimization enabled', function() {

		const file = newFile('<%= environment %>', '.ejs')

		return index(file, { optimize: true }).then((data) => {

			assert.strictEqual(data, 'prod')

		})

	})

	describe('.in()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.in(), 'ejs')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.in(''), 'ejs')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.in({ in: 'xml' }), 'xml')

		})

	})

	describe('.out()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.out(), 'html')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.out(''), 'html')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.out({ out: 'xml' }), 'xml')

		})

	})

	describe('.cache', function() {

		it('should be an array', function() {

			assert.isArray(index.cache)

		})

	})

	after(function() {

		fs.unlinkSync(dataPath)

	})

})