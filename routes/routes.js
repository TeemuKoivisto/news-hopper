var Post = require('../models/post');

module.exports = function(app) {
	app.get('/posts', Post.findAll);

	app.post('/posts', Post.create);
};
