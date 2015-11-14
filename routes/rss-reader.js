var Post = require('../models/post');
var xparser = require('xml2js').parseString;
var request = require('request');

module.exports.readRSS = function(req, res) {
	
	var rssurl = 'http://www.livegamers.fi/misc/xml/Livegamers_RSS.xml';
	
	request.get({ url: rssurl }, function(err, response, body) {
		if (err) console.log(err);
		//console.log(res);

		xparser(body, function (err, result) {
			for(var item in result.rss.channel[0].item) {
				var item = result.rss.channel[0].item[item];
				var post = {
					title: item.title[0],
					link: item.link[0]
				}
				console.log('', post);
				var newPost = new Post({
					title: item.title[0],
					url: item.link[0]
				});
				newPost.save(function(err) {
					if (err) console.log(err);
				})
				//console.log(result.rss.channel[0].item[item]);
			}
		});
	})
};
