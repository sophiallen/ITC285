// var request = require('bluebird').promisifyAll(require('request'), {multiArgs: true});
import request from 'request';
import cheerio from 'cheerio';

function search(city, jobTitle, keywords){
	return new Promise( (resolve, reject) => {

		//create url from search criteria
		let baseUrl = 'http://' + city + '.craigslist.org';
		let path = '/search/jjj?query=' +  jobTitle + '&sort=rel';
		
		//create array of keywords to look for
		keywords = keywords.split(/ |, /);

		//get the initial search results, 
		getHtml(baseUrl + path).then(cheerio.load)
		.then( $ => {

			let refs = [];

			//grab the hrefs for search results
			$('a.result-title').each( (i, item) => {
				if (item && item.attribs.href){
					console.log("link: " + item.attribs.href);
					let link = item.attribs.href;
					if (!link.includes('http')) {
						link = baseUrl + item.attribs.href;
					}
					refs.push(link);
				}
			});

			//Map hrefs to promises to get html, and wait on them to fulfill. 
			return Promise.all(refs.map(getHtmlWithUrl));

		}).then( jobPosts => {
			//filter out any failed requests. 
			let filteredPosts = jobPosts.filter( result => {
				if (result instanceof Error) {
					console.log("found error!");
					return false;
				} else {
					return true;
				}
			});

			//scrape posts for job titles and requirements.
			let data = scrape(filteredPosts);

			//scrape requirements for keyword matches.
			data = process(keywords, data);
			
			//return the results!
			resolve(data);

		}).catch( error => {
			reject(new Error(error));
		});
	});
}

function scrape(jobPosts) {
	console.log("scraping... ");

	return jobPosts.map(post => {
		let $ = cheerio.load(post.body);

		let title = $('span#titletextonly').text();
		let reqs = $('section#postingbody li').text(); 
		console.log("title: " + title);
		if (!reqs){
			reqs = $('section#postingbody').text();
		}

		return {title: title, reqs: reqs, url: post.url};
	});

}

function getHtml(url){

	return new Promise( (resolve, reject) => {
		console.log("getting " + url);
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

function getHtmlWithUrl(url){

	return new Promise((resolve, reject)=>{
		getHtml(url).then((body) => {
			console.log("retrived " + url);
			resolve({url: url, body: body});
		}).catch(reject);
	});
}

function process(terms, results){
	let regex = new RegExp(terms.join("|"), "g");
	let counts = [];
	let rankings = [];

	for (let post in results){

		let text = results[post].reqs + results[post].title;
		let matches = text.toLowerCase().match(regex);

		if (matches){
			matches.forEach( (term) => {
				if (term in counts ){
					counts[term] += 1;
				} else {
					counts[term] = 1;
				}
			});
			rankings[results[post].title] = {'matches': matches.length, url: results[post].url};
		} 
	}
	console.log("Final Count", counts);
	return {'rankings': rankings, 'counts': counts};
}

//quick process avoids the complexity of using regex
function quickProcess(terms, results){
	let counts = {};
	let rankings = {};

	//initialize counts of each term to zero. 
	terms.map(term=>{counts[term]=0;});
	console.log("counts: " + counts);
	//loop over posts in cheerio results
	for (let post in results){
		//grab its text
		let text = results[post].reqs.toLowerCase().split(" ");
		let rank = 0;

		//increment term counts, and this post's rank
		text.map(word => {
			if (word in counts){
				counts[word]++;
				rank++;
			}
		});
		if (rank > 0){
			rankings[results[post].title] = rank;
		}
	}
	console.log("final count: " + counts);
	return {'counts': counts, 'rankings': rankings};
}


module.exports.search = search;