const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const conf = require('./config/defaultConfig.js');

const server = http.createServer( (req,res) => {
	const url = req.url;
	const filePath = path.join(conf.root, req.url);
	fs.stat(filePath, (err,stats) => {
		if(err) {
			res.statusCode = 404;
			res.setHeader('Content-Type','text/plain');
			res.end(`${filePath} is not a directory or file`);
			return;
		}
		// 如果是文件
		if(stats.isFile()) {
			res.statusCode = 200;
			res.setHeader('Content-Type','text/plain');
			// fs.readFile(filePath, (err,data) => {
			// 	res.end(data);
			// });  //不介意使用读的速度过慢
			fs.createReadStream(filePath).pipe(res); //用流的方式读写
		}else if (stats.isDirectory()) {
			fs.readdir(filePath, (err,files) => {
				res.statusCode = 200;
				res.setHeader('Content-Type','text/plain');
				res.end(files.join(','));
			});
		}
	});
	// res.statusCode = 200;
	// res.setHeader('Content-Type','text/html');
	// res.end(filePath);
});

server.listen( conf.port , conf.hostname , () => {
	const addr = `http://${conf.hostname}:${conf.port}`;
	console.log(`Server started at ${chalk.green(addr)}`);
});