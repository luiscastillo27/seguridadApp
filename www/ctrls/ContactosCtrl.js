(function(){
    
    var app = angular.module('ContactosCtrl', []);

    app.controller('ContactosCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicLoading' , '$stateParams',  function ($scope, restApi, locStr, $state, auth, $ionicLoading, $stateParams) {
        
        
        auth.redirectIfNotExists();
        $scope.tokn1 = auth.getToken();
  
        //MOSTRAR TODAS LOS CONTACTOS
        $scope.mostrarContactos = function(){
        	$scope.contactos = [];
	    	restApi.call({
				method: 'get',
				url: 'contactos/listar/'+ $scope.tokn1 ,
				response: function (resp) {
				    $scope.contactos = resp;   
				},
				error: function (err) {
				    console.log(err);
				},
				validationError: function (valid) {
				    console.log(valid);
				}
			});
        }

        $scope.mostrarContactos();
    	
    	$scope.btnSolicitud = function(){
        	$state.go('tab.solici');
        }
		
		$scope.cargar = function(){
            $scope.mostrarContactos();
            $scope.$broadcast('scroll.refreshComplete'); 
        }

    }]);

}());  