'use strict';

app
	.factory('Config', function(ApiEndpoint) {
		var apiBase = ApiEndpoint.url;
	  return {
	      apiBase : apiBase
	  };
	})
	.factory('Server', function(ApiEndpoint) {
		var serverBase = ApiEndpoint.serverBase;
	  return {
	      serverBase : serverBase
	  };
	});
