(function(){
    
    var app = angular.module('AjustesCtrl', []);

    app.controller('AjustesCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicPopup' ,function ($scope, restApi, locStr, $state, auth, $ionicPopup) {
        
        
    	auth.redirectIfNotExists();
    
    	$scope.mostrar = function(){
    		$scope.hash = auth.getToken();
    	}
    	
        $scope.btnSalir = function(){
            navigator.notification.confirm("¿Quieres cerrar la sesión?", function(buttonIndex){
                switch(buttonIndex){
                    case 1:
                        auth.logout();
                    break;
                    case 2:
                        console.log("No cerrar sesión!")
                    break;
                }
            }, "¿Seguro?", ["Aceptar", "Cancelar"]);
        }
    	
        $scope.cargar = function(){
            $scope.mostrar();
            $scope.$broadcast('scroll.refreshComplete'); 
        }

    }]);

}());  