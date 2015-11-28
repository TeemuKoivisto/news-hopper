var Post = require('../models/post');
var RSSreader = require('./rss-reader');
var RSSbot = require('./rss-reader-bot');

var bot = null;

module.exports = function(app) {
	app.get('/posts', Post.findAll);

	app.post('/posts', Post.create);
	app.post('/posts2', Post.createIfUnique);
    
	app.get('/rss', RSSreader.readRSS);
	
	app.get('/rssbot', function(req, res) {
		if (!bot) {
			bot = new RSSbot();
			bot.start();
			res.status(200).send('Rss-bot initiliazed succesfully');
		} else {
			bot.refresh();
			res.status(200).send('Rss-bot refreshed succesfully');
		}
	});
};
