var
	httpCluster
	,cluster = require('cluster')
	;
/**
 * setup httpd workers
 * watch for problems to restart the workers
 */
httpCluster = function(){
var 	defaults = {
	// all keys for required properties
		PORT: 8888
		,NODE_ENV: 'develop'
	}
	,settings = (require('package.json') || {}).httpCluster || {}
	;
	if(cluster.isMaster){
		// setup settings for passing to workers
		httpCluster.util.merge( defaults, env, settings );
		// TODO logic for forking
		// need to limit number of restarts and also try to automatically compute how many instances to fork
		cluster.fork(); // n
		cluster.on('disconnect', function(worker){
			console.error('disconnected');
			cluster.fork();
		});
	}else{
		var server
		,serverDomain = require('domain').create()
		,httpd = require('./httpd')
		;
		serverDomain.on('error', function(err){
			var killer;
			console.error('restart: %s', JSON.stringify(err));
			try{
				killer = setTimeout(function(){
					process.exit(1);
				}, 5000);
				killer.unref();
				server.close();
			}catch(errKilling){
				console.error('server.close failed: %s', JSON.stringify(errKilling));
			}finally{
				try{
					cluster.worker.disconnect();
				}catch(errDisconnect){
					console.error('worker disconnect failed: %s', errDisconnect);
				};
			};
		});
		serverDomain.run(function(){
			server = httpd( settings );
			console.log("worker %s pid %s in %s mode listening on %s", cluster.worker && cluster.worker.id, process.pid, server.env, server.port);
		});
	};
};
httpCluster.util = {
	merge: function(){
	// for first, see if second has val, cast it to type from first, then overwrite
	// for new props add them
	// repeat for additional args
		var a = arguments[0], b, i = 1, val, type, isNumberStringBoolean = /number|string|boolean/;
		a = a || {};
		while(b = arguments[ i++ ]){
			Object.keys(b).forEach(function(key){
			// try to keep the original type
				switch( typeof( a[ key ] ) ){
				case 'number':
					a[ key ] = Number( b[ key ] );
				break;
				case 'string':
					a[ key ] = String( b[ key ] );
				break;
				case 'boolean':
					a[ key ] = Boolean( b[ key ] );
				break;
				default:
					a[ key ] = val;
				};
			});

		};
		return a;
	}
};
module.exports = exports = httpCluster;
