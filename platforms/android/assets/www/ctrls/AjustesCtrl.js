(function(){
    
    var app = angular.module('AjustesCtrl', []);

    app.controller('AjustesCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicLoading' ,function ($scope, restApi, locStr, $state, auth, $ionicLoading) {
        
        
    	auth.redirectIfNotExists();
    
        $scope.show = function() {
            $ionicLoading.show({
                template: 'Saliendo...'
            }).then(function(){

            });
        }

        $scope.hide = function(){
            $ionicLoading.hide().then(function(){
                           
            });
        };

    	$scope.mostrar = function(){
    		$scope.hash = auth.getToken();
    	}

        $scope.mostrar();
    	
        $scope.btnSalir = function(){
            navigator.notification.confirm("¿Quieres cerrar la sesión?", function(buttonIndex){
                switch(buttonIndex){
                    case 1:
                        $scope.show();
                        setTimeout(function(){
                            $scope.hide();
                            auth.logout();
                        }, 3000);
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