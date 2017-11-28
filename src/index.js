const yargs = require('yargs'); 
const Server = require('./app');
/* 
	bin/anydoor -p 8000  调用方法传递参数
	chmod +x bin/anydoor 
*/

const argv = yargs
	.usage('anywhere [options]')
	.option('p', {
		alias: 'port',
		describe: '端口号',
		default: 9527
	})
	.option('h', {
		alias: 'hostname',
		describe: 'host',
		default: '127.0.0.1'
	})
	.option('d', {
		alias: 'root',
		describe: 'root path',
		default: process.cwd()
	})
	.version()
	.alias('v', 'version')
	.help()
	.argv;

const server = new Server(argv);
server.start();

