var
	httpd
	,http = require('http')
	,router = require('./router')
	,fs = require('fs')
	;

httpd = function( settings ){
		var server = http.createServer(function(req, res){
			console.log('=-====== req:');
			console.log(req);
			res.writeHead(200, {'Content-Type':'text/plain'});
			res.end('ok');
		})
		.on('error', function(e){
			console.error(e);
		})
/*
 * readr = createReadStream('file');
 * readr.pipe( res );
 * */
		server.settings = settings;

		server.listen( settings.PORT );

		return server;
};

module.exports = exports = httpd;

