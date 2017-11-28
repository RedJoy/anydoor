const {cache} = require('../config/defaultConfig.js');

function refreshRes(stats,res) {
	const {maxAge,expires,cacheControl,lastModified,etag} = cache;

	if(expires) {
		res.setHeader('Expirse', (new Date(Date.now() + maxAge * 1000)).toString());
	}

	if(cacheControl) {
		res.setHeader('Cache-Control', `publie, max-age=${maxAge}`);
	}

	if(lastModified) {
		res.setHeader('Last-Modified',stats.mtime.toUTCString());
	}

	if(etag) {
		res.setHeader('ETag',`${stats.size}-${stats.mtime}`);
	}
}

module.exports = function isFresh(stats,req,res) {
	refreshRes(stats,res);

	const lastModified = req.headers['if-modified-since'];
	const etag = req.headers['if-none-match'];

	if(lastModified && lastModified != res.getHeader('Last-Modified')){
		return false;
	}

	if(etag && etag !== res.getHeader('ETag')) {
		return false;
	}
};
