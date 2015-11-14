var assert = require('assert');
var chai = require('chai')
var expect = chai.expect

var request = require('request');
var nock = require("nock");
var rssmocks = require('./rss-feeds.mock')
var postmodelmock = require('./post_model.mock')

var rssbot = require('../routes/rss-reader-bot')
rssbot = new rssbot;
var fakeFeeds = [
	{
		name: 'Ilta-Sanomat',
		url: 'http://www.iltasanomat.fi/rss/tuoreimmat.xml',
		lastPosts: []
	}
]
rssbot.injectVariables(fakeFeeds, postmodelmock);

describe('rss bot', function() {
	it('should be able to get mocked rss-feed', function(done) {
		rssmocks.mockSingleRSS().then(function() {
			request.get("http://www.iltasanomat.fi/rss/tuoreimmat.xml", function(err, response, body) {
				if (err) console.log(err);
				expect(response.statusCode).to.equal(200);
				expect(body.length).to.equal(26723);
				done();
			})
		})		
	});
	
	it('shouldnt crash when request errors', function(done) {
		try {
			rssbot.refresh();
			setTimeout(function() {
				expect(true).equal(true);
				done();
			}, 8);
		}
		catch(e) {
			expect(true).equal(false);
			done();
		}	
	});
	
	it('should parse xml into posts correctly', function(done) {
		rssmocks.mockSingleRSS().then(function() {
			rssbot.refresh();
			setTimeout(function() {
				expect(postmodelmock.posts.length).equal(30);
				expect(postmodelmock.posts[0].url).equal('http://www.iltasanomat.fi/asuminen/art-1447734582052.html?ref=rss');
				done();
			}, 8);
		})
	});
	
	it('shouldnt crash when xml is corrupted', function(done) {
		rssmocks.mockSingleRSSWithCorruptedXML().then(function() {
			try{
				rssbot.refresh();
				setTimeout(function() {
					expect(true).equal(true);
					done();
				}, 8);
			}
			catch(e) {
				expect(true).equal(false);
				done();
			}
		})
	});
	
	it('should update feed by 29 posts', function(done) {
		rssmocks.mockSingleRSS2().then(function() {
			rssbot.refresh();
			setTimeout(function() {
				expect(postmodelmock.posts.length).equal(59);
				expect(rssbot.rssFeeds[0].lastPosts.length).equal(30);
				expect(rssbot.rssFeeds[0].lastPosts[0].link).equal('http://www.iltasanomat.fi/lemmikit/art-1447735883884.html?ref=rss');
				done();
			}, 8);
		})
	});
	
	it('shouldnt update feed when there is no new posts', function(done) {
		rssmocks.mockSingleRSS2().then(function() {
			rssbot.refresh();
			setTimeout(function() {
				expect(postmodelmock.posts.length).equal(59);
				expect(rssbot.rssFeeds[0].lastPosts.length).equal(30);
				expect(rssbot.rssFeeds[0].lastPosts[0].link).equal('http://www.iltasanomat.fi/lemmikit/art-1447735883884.html?ref=rss');
				done();
			}, 8);
		})
	});
})
