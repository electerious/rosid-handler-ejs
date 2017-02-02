# rosid-handler-ejs

[![Travis Build Status](https://travis-ci.org/electerious/rosid-handler-ejs.svg?branch=master)](https://travis-ci.org/electerious/rosid-handler-ejs) [![Coverage Status](https://coveralls.io/repos/github/electerious/rosid-handler-ejs/badge.svg?branch=master)](https://coveralls.io/github/electerious/rosid-handler-ejs?branch=master) [![Dependencies](https://david-dm.org/electerious/rosid-handler-ejs.svg)](https://david-dm.org/electerious/rosid-handler-ejs#info=dependencies)

A function that loads an EJS file and transforms it to HTML.

## Install

```
npm install rosid-handler-ejs
```

## Usage

### API

```js
const ejs = require('rosid-handler-ejs')

ejs('/src/index.ejs').then((data) => {})
ejs('/src/index.xml').then((data) => {})
ejs('/src/index.ejs', { optimize: true }).then((data) => {})
```

### Rosid

Add the following object to your `rosidfile.json`, `rosidfile.js` or [routes array](https://github.com/electerious/Rosid#routes). `rosid-handler-ejs` will transform all matching EJS files in your source folder to HTML.

```json
{
	"name"    : "EJS",
	"path"    : "[^_]*.{html,ejs}*",
	"handler" : "rosid-handler-ejs"
}
```

```html
<!-- index.ejs -->
<h1>Hello <%= 'World' %></h1>
```

```html
<!-- index.html (output) -->
<h1>Hello World</h1>
```

## Parameters

- `filePath` `{String}` Absolute path to file.
- `opts` `{?Object}` Options.
	- `optimize` `{?Boolean}` - Optimize output. Defaults to `false`.

## Returns

- `{Promise}({String|Buffer})` The transformed file content.