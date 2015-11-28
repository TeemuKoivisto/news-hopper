var database = {
	posts: []
}

// var Post = function(model) {
	// this.url = model.url;
	// this.title = model.title;
// }

var Post = function() {}

// Post.prototype.saveIfDoesntExist = function(newPost) {
	// // var newPost = {
		// // url: this.url,
		// // title: this.title
	// // }
	// // console.log('lisään postin ', newPost)
	// database.posts.push(newPost);
// }

module.exports = Post;
module.exports.saveIfUnique = function(post) {
    database.posts.push(post);
}

module.exports.posts = database.posts;