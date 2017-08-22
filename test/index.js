'use strict'

const os = require('os')
const path = require('path')
const assert = require('chai').assert
const uuid = require('uuid/v4')
const index = require('./../src/index')

const fsify = require('fsify')({
	cwd: os.tmpdir()
})

describe('index()', function() {

	it('should return an error when called without a filePath', async function() {

		return index().then((result) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `'filePath' must be a string`)

		})

	})

	it('should return an error when called with invalid options', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`
			}
		])

		return index(structure[0].name, '').then((result) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `'opts' must be undefined, null or an object`)

		})

	})

	it('should return an error when called with a fictive filePath', async function() {

		return index(`${ uuid() }.ejs`).then((result) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when called with invalid EJS', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: '<% + %>'
			}
		])

		return index(structure[0].name).then((result) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should load empty EJS and transform it to HTML', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: ''
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, structure[0].contents)

	})

	it('should load EJS and transform it to HTML', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: '<%= environment %>'
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, 'dev')

	})

	it('should load EJS from a relative path and transform it to HTML', async function() {

		const folderName = uuid()
		const fileName = `${ uuid() }.ejs`

		const structure = await fsify([
			{
				type: fsify.DIRECTORY,
				name: folderName,
				contents: [
					{
						type: fsify.FILE,
						name: fileName,
						contents: 'value'
					}
				]
			},
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: `<%= include('./${ folderName }/${ fileName }') %>`
			}
		])

		const file = path.relative(process.cwd(), structure[1].name)
		const result = await index(file)

		assert.strictEqual(result, structure[0].contents[0].contents)

	})

	it('should load EJS and transform it to HTML with custom global data', async function() {

		const data = { key: 'value' }

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: '<%= key %>'
			}
		])

		const result = await index(structure[0].name, { data })

		assert.strictEqual(result, data.key)

	})

	it('should load EJS and transform it to HTML with external custom global data', async function() {

		const data = { key: 'value' }

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: '<%= key %>'
			},
			{
				type: fsify.FILE,
				name: `${ uuid() }.json`,
				contents: JSON.stringify(data)
			}
		])

		const result = await index(structure[0].name, { data: structure[1].name })

		assert.strictEqual(result, data.key)

	})

	it('should load EJS and transform it to optimized HTML when optimization enabled', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: '<%= environment %>'
			}
		])

		const result = await index(structure[0].name, { optimize: true })

		assert.strictEqual(result, 'prod')

	})

	it('should load EJS and transform it to HTML with custom data from a JS data file', async function() {

		const fileName = uuid()
		const data = { key: 'value' }

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ fileName }.ejs`,
				contents: '<%= key %>'
			},
			{
				type: fsify.FILE,
				name: `${ fileName }.data.js`,
				contents: `module.exports = ${ JSON.stringify(data) }`
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, data.key)

	})

	it('should load EJS and transform it to HTML with custom data from a JSON data file', async function() {

		const fileName = uuid()
		const data = { key: 'value' }

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ fileName }.ejs`,
				contents: '<%= key %>'
			},
			{
				type: fsify.FILE,
				name: `${ fileName }.data.json`,
				contents: JSON.stringify(data)
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, data.key)

	})

	describe('.in()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.in(), '.ejs')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.in(''), '.ejs')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.in({ in: '.xml' }), '.xml')

		})

	})

	describe('.out()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.out(), '.html')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.out(''), '.html')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.out({ out: '.xml' }), '.xml')

		})

	})

	describe('.cache', function() {

		it('should be an array', function() {

			assert.isArray(index.cache)

		})

	})

})