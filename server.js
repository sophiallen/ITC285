import config, {logStars} from './config';
import apiRouter from './api';
// import fs from 'fs';

import express from 'express';
const server = express();

server.set('view engine', 'ejs');

server.get('/', (req, res) => {
	logStars('Yay!');
	res.render('index', {
		content: 'Hello Ejs!'
	});
});

server.use('/api', apiRouter);

//Allow static serving of files in public directory without routing. 
//note: must be used AFTER other route handlers.
server.use(express.static('public'));

server.listen(config.port, ()=> {
	console.info('Listening on port ', config.port);
});