import express from 'express';
import crawler from '../lib/WebCrawl.js';

const router = express.Router();

router.get('/', (req, res) => {
	res.send({data: []});
});

router.get('/search', (req, res) => {
	console.log("query: " + req.query.jobTitle + " " + req.query.city);
	let jobTitle = req.query.jobTitle;
	let city = req.query.city;
	
	crawler.search(city, jobTitle).then((result) => {
		res.send(result);
	});
});


export default router;