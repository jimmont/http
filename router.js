var
	router
	;
/**
 * location.href -> <match 'string' || /regex/ || function(returns boolean)> -> function handler()
 */

router = {
	Location: function(req){
	/*
	 * returns location 
	 * 
	 */

		// ... TODO
		this.pathname = '';
	}
	,get: function(location){
		var route, i = 0;
		while(route = this.state[i++]){
			if(route(location)){
				// TODO handle response
				// return appropriate type (TODO)
				route.handler( location );
				return 'something from handler';
			};
		};
		return function(){
			// TODO throw 404, return appropriate type
			return '';
		};
	}
	,state: []
	,add: function(route, handler){
	// convert route to function
		if(typeof(route) !== 'function'){
			route = (function( pattern ){
				if(pattern instanceof RegExp){
					return function(location){
						return pattern.test(location.pathname);
					};
				}else{
					return function(location){
						return location.pathname === pattern;
					};
				};
			})( route );
		};

		route.handler = handler;
		this.state.push( route );
	}
};

module.exports = exports = router;
