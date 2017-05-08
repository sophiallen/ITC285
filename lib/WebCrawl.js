// var request = require('bluebird').promisifyAll(require('request'), {multiArgs: true});
import request from 'request';
import cheerio from 'cheerio';


module.exports.search = function(city, jobTitle){
	return new Promise( (resolve, reject) => {
		let baseUrl = 'http://' + city + '.craigslist.org';
		let path = '/search/jjj?query=' +  jobTitle + '&sort=rel';

		getHtml(baseUrl + path).then(cheerio.load).then( ($) => {
			let links = $('a.result-title');
			let refs = [];

			//grab the hrefs for search results
			links.each(function(i, item){
				var link = item.attribs.href.includes("craigslist") ? 'http:' + item.attribs.href : baseUrl + item.attribs.href;
				refs.push(link);
			});

			//Map hrefs to promises to get html, and wait on them to fulfill. 
			return Promise.all(refs.map(getHtml));

		}).then( (jobPosts) => {
			//scrape the job requirements from the job post bodies. 
			let filteredPosts = jobPosts.filter( (result) => {
				if (result instanceof Error) {
					console.log("found error!");
					return false;
				} else {
					return true;
				}
			});

			let data = scrape(filteredPosts);
			data = process(["python", "javascript", "java ", "c#", "creative"], data);
			console.log(data.counts);
			resolve(data);

		}).catch((error) => {
			reject(new Error(error));
		});
	});
}

function scrape(jobPosts) {
	console.log("Scraping...");
	let posts = jobPosts.map(cheerio.load);
	let requirements = [];

	posts.forEach(function($){
		//scrape it!
		let title = $('span#titletextonly').text();
		let item = $('section#postingbody li').text(); 
		console.log("title: " + title);
		if (item){
			requirements.push({title: title, reqs: item.replace(/(\r\n|\n|\r|\t)/gm,"")});
		}
	});
	return requirements;
}

function getHtml(url){

	return new Promise(function(resolve, reject) {
		request.get(url, function (err, response, body) {
		    if (err || response.statusCode != 200 ){
		    	console.log("getHTML Error!" + err);
		        reject(new Error(err));
		    } else {
			    resolve(body);		    	
		    }
		});
	});
}

function process(terms, results){
	let regex = new RegExp(terms.join("|"), "g");
	console.log("regex: " + regex);
	let counts = [];
	let rankings = [];
	for (let post in results){
		let matches = results[post].reqs.toLowerCase().match(regex);
		console.log("matches: " + matches);
		if (matches){
			matches.forEach( (term) => {
				if (term in counts ){
					counts[term] += 1;
				} else {
					counts[term] = 1;
				}
			});
		} 
		console.log("current count: ", counts);
		rankings[results[post].title] = matches ? matches.length : 0;
	}
	console.log("Final Count", counts);
	return {'rankings': rankings, 'counts': counts};
}
