import express from 'express';
const router = express.Router();
import request from 'request';
import cheerio from 'cheerio';
import Promise from 'bluebird';

Promise.promisifyAll(request);

router.get('/', (req, res) => {
	res.send({data: []});
});

router.get('/search', (req, res) => {
	console.log("query: " + req.query.jobTitle + " " + req.query.city);
	let jobTitle = req.query.jobTitle;
	let city = req.query.city;
	let qs  = '/search/jjj?query=' + jobTitle + '&sort=rel';
	let baseUrl = 'https://' + req.query.city + '.craigslist.org';

	request( baseUrl + qs,
	 (err, response, body) => {
		  // console.log('error:', err); // Print the error if one occurred 
		  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
		  const doc = cheerio.load(body);

		  let links = doc('a.result-title');

		  let refs = [];

		  for (let i = 0; i < 10; i++){
		  	refs.push(links[i].attribs.href);
		  }

		  let bods = Promise.resolve();

		  Promise.map(refs, (link) => {
		  	  console.log("processing " + link);
		  	  bods = bods.then(function() {
				  return request.getAsync(baseUrl + link);
		  	  });
		  	  return bods;
		  }).map(function(respBody){
		  	console.log("getting respbody");
		  	return respBody[1];
		  }).then(function() {
		  		console.log("all requests saved");
		  		// console.log(bods);
		  }).catch(function(e){
		  		console.log("error: " + e);
		  });

		  // let bods = refs.map((link) =.t> {
			 //  request(baseUrl + link, (err, resp, bod) => {
			 //  		console.log("got one, " + bod.length);
			 //  		return bod;
			 //  });		  	
		  // });

		  res.send("done");
	});
});


export default router;