var app = angular.module('browserApp', ['restangular']);

app.run(function ($rootScope) {
	$rootScope.path = '/';
	$rootScope.tree = {};
	$rootScope.activeNode = null;
	$rootScope.properties = {};
	$rootScope.breadcrumb = [];

	$rootScope.isEmpty = function(obj){
        return _.size(obj) == 0;
    };

    $rootScope.getTypeOf = function(obj){
        return typeof obj;
    };

    $rootScope.findNode = function(path, root){
       	function search(target, tree){
       	 	if(target.length > 0){
            	for(child in tree.children){
                	if (tree.children.hasOwnProperty(child) && ~~child == child && target[0] == tree.children[child].name){
                    	target.shift();
                    	return search(target,tree.children[child]);
                	}
            	}
        	}
        	return tree;
    	}
  		
  		var target = path.split('/');
  		target.shift();
  		return search(target, root);
    }
});

app.config(function($locationProvider){
    $locationProvider.html5Mode(true);
});
