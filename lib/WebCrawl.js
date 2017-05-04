var request = require('bluebird').promisifyAll(require('request'), {multiArgs: true});
import cheerio from 'cheerio';

module.exports.get = (city, jobTitle) => {
		let baseUrl = 'http://' + city + '.craigslist.org';
		let path = '/search/jjj?query=' +  jobTitle + '&sort=rel';

		getHtml(baseUrl + path).then(cheerio.load).then( ($) => {
			let links = $('a.result-title');
			let refs = [];

			for (let i = 0; i < links.length; i++) {
				let ref = links[i].attribs.href;
				refs.push(baseUrl + ref);
			}
			//return array of promises and wait on them. 
			return Promise.all(refs.map(getHtml));
		}).then( (jobPosts) => {
			//load all the post bodies. 
			let posts = jobPosts.map(cheerio.load);
			let requirements = [];
			posts.forEach(function($){
				//scrape it!
				let item = $('section#postingbody ul').children().html(); 
				if (item){
					requirements.push(item.text().replace("\t",""));
					console.log(item);
				}
			});
		}).catch(console.error);
}


module.exports.search = function(city, jobTitle){
	return new Promise(function(resolve, reject) {
		let baseUrl = 'http://' + city + '.craigslist.org';
		let path = '/search/jjj?query=' +  jobTitle + '&sort=rel';

		getHtml(baseUrl + path).then(cheerio.load).then( ($) => {
			let links = $('a.result-title');
			let refs = [];

			for (let i = 0; i < links.length; i++) {
				let ref = links[i].attribs.href;
				refs.push(baseUrl + ref);
			}
			//return array of promises and wait on them. 
			return Promise.all(refs.map(getHtml));
		}).then( (jobPosts) => {
			//load all the post bodies. 
			let posts = jobPosts.map(cheerio.load);
			let requirements = [];
			posts.forEach(function($){
				//scrape it!
				let item = $('section#postingbody li').text(); 
				if (item){
					requirements.push(item.replace(/(\r\n|\n|\r|\t)/gm,""));
					console.log(item);
				}
			});
			resolve(requirements);
		}).catch((error) => {
			reject(error);
		});
	});
}

function getHtml(url){
	return new Promise(function(resolve, reject) {
		request.getAsync(url).spread(function (response, body) {
		    if (response.statusCode != 200)
		        reject(new Error('Unsuccessful attempt. Code: ' + response.statusCode));
		    resolve(body);
		})
	});
}