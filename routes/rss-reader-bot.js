'use strict';

var Post = require('../models/post');
var xmlparser = require('xml2js').parseString;
var request = require('request');

class RssReader {
	constructor() {
		// 430 noin kahdessa tunnissa
		this.rssFeeds = [
			{
				name: 'Ilta-Sanomat',
				url: 'http://www.iltasanomat.fi/rss/tuoreimmat.xml',
				lastPosts: []
			},
			{
				name: 'Helsingin Sanomat',
				url: 'http://www.hs.fi/uutiset/rss/',
				lastPosts: []
			},
			{
				name: 'Yle',
				url: 'http://yle.fi/uutiset/rss/uutiset.rss',
				lastPosts: []
			}
		];
	}
	
	injectVariables(feeds, postmodel) {
		this.rssFeeds = feeds;
		Post = postmodel;
	}
	
	start() {
		// milliseconds 30 mins = 10800000 ms
		var interval = 5000;
		this.refresh();
		setInterval(this.refresh.bind(this), interval);
	}
	
	refresh() {
		for(var feed in this.rssFeeds) {
			this.parseRss(this.rssFeeds[feed], feed);
		}
	}
	
	parseRss(feed, index) {
		var context = this;
		request.get({ url: feed.url, encoding: 'utf-8' }, function(err, response, body) {
			if (err) {
				console.log(err);
				return;
			} 
			body = body.replace("\ufeff", ""); // windows fixi 'Error: Non-whitespace before first tag.' virhetta varten 
			// ei toimi :( jotain mätää cdatan kanssa?
			// [Error: Invalid character in entity name
			xmlparser(body, function (error, result) {
				if (error) {
					console.log(error);
					return;
				}
				var postsLength = result.rss.channel[0].item.length;
				var amount = context.countNewPosts(feed.lastPosts, result.rss.channel[0].item[postsLength-1]);
				amount = amount === -1 ? postsLength : amount;
				// console.log('amount is ' + amount);
				var newPosts = [];
				
				for(var i = 0; i < amount; i++) {
					var item = result.rss.channel[0].item[i];
					var post = {
						title: item.title[0],
						link: item.link[0]
					}
					newPosts.push(post);
					
					var newPost = new Post({
						title: item.title[0],
						url: item.link[0]
					});
					// tähän ehkä mieluummin lisämetodi, jolla etsitään ensin tietokannasta
					// löytyykö jo kyseistä postia. tupla varmistus. 
					newPost.save(function(err) {
						if (err) console.log(err);
					})
				}
				context.updateFeedPosts(index, newPosts)
			});
		})
		// .on('error', function(err) {
			// console.log('tulipa virhe, ehkäpä pitäisi refreshaa uudestaan ', err);
		// })
		.end()
	}
	
	updateFeedPosts(index, newPosts) {
		if (newPosts.length === 0) {
			return;
		} else if (this.rssFeeds[index].lastPosts.length!==0) {
			console.log('newposts length ' + newPosts.length + ' feed length is '+ this.rssFeeds[index].lastPosts.length + ' and feed index ' + index)
			// console.log('newposts were ', newPosts);
			this.rssFeeds[index].lastPosts.splice(newPosts.length * -1, newPosts.length);
			Array.prototype.push.apply(newPosts, this.rssFeeds[index].lastPosts);
			this.rssFeeds[index].lastPosts = newPosts;
		} else {
			console.log('newposts length ' + newPosts.length + ' feed length is '+ this.rssFeeds[index].lastPosts.length + ' and feed index ' + index)
			Array.prototype.push.apply(this.rssFeeds[index].lastPosts, newPosts);
			console.log('feed filled '+ this.rssFeeds[index].lastPosts.length)
		}
	}
	
	countNewPosts(oldPosts, lastNewPost) {
		for(var i = oldPosts.length-1; i >= 0; i--) {
			if (oldPosts[i].link === lastNewPost.link[0]) {
				// console.log('new posts counted ' + (oldPosts.length - 1 - i));
				return oldPosts.length - 1 - i;
			}
		}
		return -1;
	}
}

module.exports = RssReader;