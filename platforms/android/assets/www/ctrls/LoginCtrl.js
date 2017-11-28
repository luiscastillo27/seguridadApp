(function(){
    
    var app = angular.module('LoginCtrl', []);

    app.controller('LoginCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicPopup' ,'$ionicLoading', function ($scope, restApi, locStr, $state, auth, $ionicPopup, $ionicLoading) {
       

       $scope.verifi = {
       		telefono: undefined,
       		nombre: undefined
       }

        $scope.show = function() {
            $ionicLoading.show({
                template: 'Cargando...'
            }).then(function(){

            });
       	}

        $scope.hide = function(){
            $ionicLoading.hide().then(function(){
                           
            });
        };
        
        $scope.btnVerificar = function(){

        	var data = {
        		telefono: $scope.verifi.telefono,
        		nombre: $scope.verifi.nombre,
        	}

        	$scope.show();

        	restApi.call({
			    method: 'post',
			    url: 'usuarios/autenticar',
			    data: data,
			    response: function (resp) {


                    setTimeout(function(){

    			    	$scope.hide();
    			    	if(resp.message == 'Credenciales no válidas'){
    			    		navigator.notification.confirm(resp.message, function(){
                            }, "Error", ["Aceptar"]);
                            $scope.verifi.telefono = undefined;
            				$scope.verifi.nombre = undefined;
    			    	} else {
    			    		auth.setToken(resp.message);
    	        			$state.go('tab.contactos');
    	        			$scope.verifi.telefono = undefined;
            				$scope.verifi.nombre = undefined;  
    			    	}	

                    }, 2000);		                                
			                                
			    },
			    error: function (err) {
			        console.log(err);
			    },
			    validationError: function (valid) {
			        console.log(valid);
			    }
			});

        }
   	
    	
    	$scope.crearcuenta = function(){
    		$state.go('crear-cuenta'); 
    	}

    	$scope.irLogin = function(){
    		$state.go('login'); 
    	}

    	$scope.btnNuevaCuenta = function(){

    		var data = {
        		telefono: $scope.verifi.telefono,
        		nombre: $scope.verifi.nombre,
        	}
        	$scope.show();
        
        	restApi.call({
			    method: 'post',
			    url: 'usuarios/registrar',
			    data: data,
			    response: function (resp) {

					$scope.hide();
			    	if(resp.message == 'El usuario ya existe, intentalo con otro'){
			    		navigator.notification.confirm(resp.message, function(){
                        }, "Aceptar", ["Aceptar"]);
                        $scope.verifi.telefono = undefined;
        				$scope.verifi.nombre = undefined;
			    	} else {
			    		navigator.notification.confirm("Tu cuenta ha sido creada", function(){
                        }, "Exito", ["Aceptar"]);
                        $scope.verifi.telefono = undefined;
        				$scope.verifi.nombre = undefined;
			    	}
			                                
			                                
			    },
			    error: function (err) {
			        console.log(err);
			    },
			    validationError: function (valid) {
			        console.log(valid);
			    }
			});

    	}


    }]);

}());  