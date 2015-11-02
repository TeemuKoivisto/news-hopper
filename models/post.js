var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    title: {type: String, required: true},
    url: {type: String, required: true}
});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;

module.exports.create = function(req, res, next) {
  if (req.body.title && req.body.url) {
    var newPost = new Post({
      title: req.body.title,
      url: req.body.url
    });
    newPost.save(function(err) {
      if (err) console.log(err);
      res.send('OK');
    })
  }
};

module.exports.findAll = function(req, res, next) {
  Post.find({ }, function(err, posts) {
		if (err) console.log(err);
		res.send(posts);
	});
};
