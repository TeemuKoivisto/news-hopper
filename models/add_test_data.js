var Post = require('./post');

Post.remove().then(function(err) {
	var post = new Post({ title: 'titteli', url: 'www.testiosoite.testi' })
		.save(function(err) {
			console.log(err);
		})
})
