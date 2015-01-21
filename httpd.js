var
	httpd
	,http = require('http')
	,fs = require('fs')
	;

httpd = function( settings ){
	http.createServer().on('error', function(e){

	});
};

module.exports = exports = httpd;

