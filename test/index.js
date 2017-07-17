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

		return index().then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(`'filePath' must be a string`, err.message)

		})

	})

	it('should return an error when called with invalid options', async function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`
			}
		]

		const file = (await fsify(structure))[0].name

		return index(file, '').then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(`'opts' must be undefined, null or an object`, err.message)

		})

	})

	it('should return an error when called with a fictive filePath', async function() {

		const file = `${ uuid() }.ejs`

		return index(file).then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when called with invalid EJS', async function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: '<% + %>'
			}
		]

		const file = (await fsify(structure))[0].name

		return index(file).then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should load empty EJS and transform it to HTML', async function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: ''
			}
		]

		const file = (await fsify(structure))[0].name
		const result = await index(file)

		assert.strictEqual(result, structure[0].contents)

	})

	it('should load EJS and transform it to HTML', async function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: '<%= environment %>'
			}
		]

		const file = (await fsify(structure))[0].name
		const result = await index(file)

		assert.strictEqual(result, 'dev')

	})

	it('should load EJS from a relative path and transform it to HTML', async function() {

		const folderName = uuid()
		const fileName = `${ uuid() }.ejs`

		const structure = [
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
		]

		const file = (await fsify(structure))[1].name
		const relativeFile = path.relative(process.cwd(), file)
		const result = await index(relativeFile)

		assert.strictEqual(result, structure[0].contents[0].contents)

	})

	it('should load EJS and transform it to HTML with custom global data', async function() {

		const data = { key: 'value' }

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: '<%= key %>'
			}
		]

		const file = (await fsify(structure))[0].name
		const result = await index(file, { data })

		assert.strictEqual(result, data.key)

	})

	it('should load EJS and transform it to HTML with external custom global data', async function() {

		const data = { key: 'value' }

		const structure = [
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
		]

		const parsedStructure = await fsify(structure)
		const result = await index(parsedStructure[0].name, { data: parsedStructure[1].name })

		assert.strictEqual(result, data.key)

	})

	it('should load EJS and transform it to optimized HTML when optimization enabled', async function() {

		const structure = [
			{
				type: fsify.FILE,
				name: `${ uuid() }.ejs`,
				contents: '<%= environment %>'
			}
		]

		const file = (await fsify(structure))[0].name
		const result = await index(file, { optimize: true })

		assert.strictEqual(result, 'prod')

	})

	it('should load EJS and transform it to HTML with custom data from a JS data file', async function() {

		const fileName = uuid()
		const data = { key: 'value' }

		const structure = [
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
		]

		const file = (await fsify(structure))[0].name
		const result = await index(file)

		assert.strictEqual(result, data.key)

	})

	it('should load EJS and transform it to HTML with custom data from a JSON data file', async function() {

		const fileName = uuid()
		const data = { key: 'value' }

		const structure = [
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
		]

		const file = (await fsify(structure))[0].name
		const result = await index(file)

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