var Post = require('./post');

Post.remove()
.then(function() {
	return new Post({ title: 'titteli', link: 'www.testiosoite.testi', feed: 'testi' }).save();
})
.then(function() {
    // was success
})
.catch(function(err) {
    console.log('Error in adding test data ', err);
})
