var mongoose = require('mongoose');
mongoose.Promise = Promise;

var PostSchema = mongoose.Schema({
    title: {type: String, required: true},
    link: {type: String, required: true}
});

var Post = mongoose.model('Post', PostSchema);
module.exports = Post;

module.exports.saveIfUnique = function(post) {
    Post.findOne({ title: post.title, link: post.link })
    .then(function(found) {
        if (found===null) {
            // var newPost = new Post({ title: post.title, link: post.link });
            return new Post({ title: post.title, link: post.link }).save();
        } else {
            console.log('Post already exists in database');
            return;
        }
    })
    .then(function() {
        console.log('save succesfull', post);
    })
    .catch(function(err) {
        console.log('Error in saveIfUnique' + err);
    })
}

module.exports.create = function(req, res, next) {
  if (req.body.title && req.body.link) {
    var newPost = new Post({
      title: req.body.title,
      link: req.body.link
    });
    newPost.save(function(err) {
      if (err) console.log(err);
      res.status(200).send('Post posted succesfully');
    })
  }
};

module.exports.createIfUnique = function(req, res, next) {
    if (req.body.title && req.body.link) {
        Post.findOne({ title: req.body.title, link: req.body.link })
        .then(function(post) {
            if (post===null) {
                var newPost = new Post({
                    title: req.body.title,
                    link: req.body.link
                });
                return newPost.save();
            } else {
                res.status(200).send('Post already exists in database');
                return;
            }
        })
        .then(function() {
            res.status(200).send('Post was unique and was saved succesfully');
        })
        .catch(function(err) {
            console.log('virhe! ' + err);
            res.status(500).send('Encountered error ' + err);
        })
    }
};

module.exports.findAll = function(req, res, next) {
  Post.find({ }, function(err, posts) {
		if (err) console.log(err);
		res.send(posts);
	});
};
