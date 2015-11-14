var fs = require('fs');
var nock = require('nock')

module.exports.mockSingleRSS = function() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./test/IS_tuoreimmat_1.xml', 'utf-8', function(err, data) {
			if (err) {
				console.log(err);
				reject(err);
			}
			// console.log(data)
			nock("http://www.iltasanomat.fi/rss/tuoreimmat.xml")
			.get('')
			.reply(200, data);
			resolve()
		})
	})
}

module.exports.mockSingleRSS2 = function() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./test/IS_tuoreimmat_2.xml', 'utf-8', function(err, data) {
			if (err) {
				console.log(err);
				reject(err);
			}
			// console.log(data)
			nock("http://www.iltasanomat.fi/rss/tuoreimmat.xml")
			.get('')
			.reply(200, data);
			resolve()
		})
	})
}

module.exports.mockSingleRSSWithCorruptedXML = function() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./test/yle_corrupted.xml', 'utf-8', function(err, data) {
			if (err) {
				console.log(err);
				reject(err);
			}
			// console.log(data)
			nock("http://www.iltasanomat.fi/rss/tuoreimmat.xml")
			.get('')
			.reply(200, data);
			resolve()
		})
	})
}