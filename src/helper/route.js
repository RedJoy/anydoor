const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify; //去除异步调用
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig.js');
const mime = require('./mime.js');

const tplPath = path.join(__dirname,'../templete/dir.tpl');
const source = fs.readFileSync(tplPath);
const templete = Handlebars.compile(source.toString());

module.exports = async function (req,res,filePath) {
	try {
		const stats = await stat(filePath);
		// 如果是文件
		if(stats.isFile()) {
			const contentType = mime(filePath);
			res.statusCode = 200;
			res.setHeader('Content-Type','text/plain');
			fs.createReadStream(filePath).pipe(res); //用流的方式读写
		}else if (stats.isDirectory()) {
			const files = await readdir(filePath);
			res.statusCode = 200;
			res.setHeader('Content-Type','text/html');
			const dir = path.relative(config.root, filePath);
			const data = {
				title: path.basename(filePath),
				dir: dir ? `/${dir}` : '',
				files
			};
			res.end(templete(data));

		}
	} catch (ex) {
		console.log(ex);
		res.statusCode = 404;
		res.setHeader('Content-Type','text/plain');
		res.end(`${filePath} is not a directory or file\n ${ex.toString()}`);
	}
}

