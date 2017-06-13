// var request = require('bluebird').promisifyAll(require('request'), {multiArgs: true});
import request from 'request';
import cheerio from 'cheerio';

let cache = {};
var searched = "";

function search(city, jobTitle, keywords){
	return new Promise( (resolve, reject) => {

		//create url from search criteria
		let baseUrl = 'http://' + city + '.craigslist.org';
		let path = '/search/jjj?query=' +  jobTitle + '&sort=rel';
		
		searched = baseUrl+path;

		//create array of keywords to look for
		keywords = keywords.split(/ |, /);

		//shortcut ajax requests if data has been cached this session
		if (cache[searched]){
			let results = cache[searched];
			let data = scrape(results);
			data = process(keywords, data);
			resolve(data);
		} else {

		//get the initial search results, 
		getHtml(baseUrl + path).then(cheerio.load)
		.then( $ => {

			let refs = [];

			//grab the hrefs for search results
			$('a.result-title').each( (i, item) => {
				if (item && item.attribs.href){
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

			cache[searched] = filteredPosts;

			//scrape posts for job titles and requirements.
			let data = scrape(filteredPosts);

			//scrape requirements for keyword matches.
			data = process(keywords, data);
			
			//return the results!
			resolve(data);

		}).catch( error => {
			reject(new Error(error));
		});

	}//end else

	});

}

function scrape(jobPosts) {
	return jobPosts.map(post => {
		let $ = cheerio.load(post.body);

		let title = $('span#titletextonly').text();
		let reqs = $('section#postingbody li').text(); 
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
			resolve({url: url, body: body});
		}).catch(reject);
	});
}

function process(terms, results){
	//todo: let jobsdata reflect how many of requested skills are matched. 

	let regex = new RegExp(terms.join("|"), "g");

	let keywordData = {};
	terms.map( term =>{
		keywordData[term] = {term: term, hits: 0, mentions: 0};
	});

	let misses = 0;
	console.log("initial values", keywordData);
	let postsData = [];

	for (let post in results){

		let text = results[post].reqs + results[post].title;
		let matches = text.toLowerCase().match(regex);

		if (matches){
			let uniqeMatches = {};
			terms.forEach( word => {
				if (matches.includes(word)){
					keywordData[word]['hits'] += 1;
				}
			});

			matches.forEach( term => {
				keywordData[term]['mentions'] += 1;
				uniqeMatches[term] = uniqeMatches[term]? uniqeMatches[term] + 1 : 0;
			});

			postsData.push({title: results[post].title, 'matches': matches.length, 'termMatches': uniqeMatches, url: results[post].url});
		} else {
			misses += 1;
		}
	}
	return {'keywordData': Object.values(keywordData), 'postsData': postsData, 'misses': misses};
	//return {'rankings': rankings, 'counts': counts, 'posts': results.length, 'hits': hits};
}

//quick process avoids the complexity of using regex
// function quickProcess(terms, results){
// 	let counts = {};
// 	let rankings = {};

// 	//initialize counts of each term to zero. 
// 	terms.map(term=>{counts[term]=0;});
// 	console.log("counts: " + counts);
// 	//loop over posts in cheerio results
// 	for (let post in results){
// 		//grab its text
// 		let text = results[post].reqs.toLowerCase().split(" ");
// 		let rank = 0;

// 		//increment term counts, and this post's rank
// 		text.map(word => {
// 			if (word in counts){
// 				counts[word]++;
// 				rank++;
// 			}
// 		});
// 		if (rank > 0){
// 			rankings[results[post].title] = rank;
// 		}
// 	}
// 	console.log("final count: " + counts);
// 	return {'counts': counts, 'rankings': rankings};
// }


module.exports.search = search;