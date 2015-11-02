var Post = require('./post');

Post.remove().then(function(err) {
	var post = new Post({ title: 'hei', url: 'asdkfjs' })
		.save(function(err) {
			console.log(err);
		})
})
