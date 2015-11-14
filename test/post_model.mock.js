var database = {
	posts: []
}

var Post = function(model) {
	this.url = model.url;
	this.title = model.title;
}

Post.prototype.save = function(cb) {
	var newPost = {
		url: this.url,
		title: this.title
	}
	// console.log('lisään postin ', newPost)
	database.posts.push(newPost);
}

module.exports = Post;

module.exports.posts = database.posts;