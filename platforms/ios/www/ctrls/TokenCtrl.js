(function(){
    
    var app = angular.module('TokenCtrl', []);

    app.controller('TokenCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicPopup' ,function ($scope, restApi, locStr, $state, auth, $ionicPopup) {
        
        
    	auth.redirectIfNotExists();
    
    	$scope.mostrar = function(){
    		$scope.hash = auth.getToken();
    	}
    
    	
        $scope.cargar = function(){
            $scope.mostrar();
            $scope.$broadcast('scroll.refreshComplete'); 
        }

    }]);

}());  