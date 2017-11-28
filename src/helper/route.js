const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify; //去除异步调用
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig.js');
const mime = require('./mime.js');
const compress = require('./compress.js');
const range = require('./range');
const isFresh = require('./cache.js');

const tplPath = path.join(__dirname,'../templete/dir.tpl');
const source = fs.readFileSync(tplPath);
const templete = Handlebars.compile(source.toString());

module.exports = async function (req,res,filePath) {
	try {
		const stats = await stat(filePath);
		// 如果是文件
		if(stats.isFile()) {
			const contentType = mime(filePath);
			res.setHeader('Content-Type','text/plain');

			//cache
			if(isFresh(stats,req,res)) {
				res.statusCode = 304;
				res.end();
				return;
			}

			let rs;
			const {code, start, end} = range(stats.size ,req,res);
			if(code == 200 ) {
				res.statusCode = 200;
				rs = fs.createReadStream(filePath);
			}else {
				res.statusCode = 206;
				rs = fs.createReadStream(filePath, {start,end});
			}

			//压缩文件
			if(filePath.match(config.compress)) {
				rs = compress(rs, req, res);
			}
			rs.pipe(res); //用流的方式读写

		}else if (stats.isDirectory()) {  //文件夹
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

