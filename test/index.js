'use strict'

const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const temp   = require('temp').track()
const index  = require('./../src/index')

const newFile = function(suffix) {

	return temp.openSync({ suffix }).path

}

const data = {
	path: path.resolve(process.cwd(), './data.json')
}

describe('index()', function() {

	before(function() {

		fs.writeFileSync(data.path, '{}')

	})

	it('should return an error when called with an invalid filePath', function() {

		return index(null, '/src', '/dist', {}).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should return an error when called with a fictive filePath', function() {

		return index('test.scss', '/src', '/dist', {}).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should load EJS and transform it to HTML when everything specified', function() {

		const file = newFile('.ejs')

		return index(file, '/src', '/dist', {}).then(({ data, savePath }) => {

			assert.isString(savePath)
			assert.strictEqual(data, '')
			assert.strictEqual(savePath.substr(-5), '.html')

		})

	})

	it('should load XML and transform it to HTML when custom fileExt specified', function() {

		const file  = newFile('.xml')
		const route = { args: { fileExt: 'xml' } }

		return index(file, '/src', '/dist', route).then(({ data, savePath }) => {

			assert.isString(savePath)
			assert.strictEqual(data, '')
			assert.strictEqual(savePath.substr(-5), '.html')

		})

	})

	it('should load EJS and transform it to XML when custom saveExt specified', function() {

		const file  = newFile('.ejs')
		const route = { args: { saveExt: 'xml' } }

		return index(file, '/src', '/dist', route).then(({ data, savePath }) => {

			assert.isString(savePath)
			assert.strictEqual(data, '')
			assert.strictEqual(savePath.substr(-4), '.xml')

		})

	})

	it('should load EJS and transform it to HTML when distPath not specified', function() {

		const file = newFile('.ejs')

		return index(file, '/src', null, {}).then(({ data, savePath }) => {

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