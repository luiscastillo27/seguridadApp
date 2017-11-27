(function(){
    
    var app = angular.module('ContactosCtrl', []);

    app.controller('ContactosCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicPopup' , '$stateParams', function ($scope, restApi, locStr, $state, auth, $ionicPopup, $stateParams) {
        
        
        auth.redirectIfNotExists();
        $scope.tokn1 = auth.getToken();
        var id = $stateParams.id;
        $scope.mensajesEms = [];
        $scope.mensajesRes = [];
        var tokn2 = "";
        $scope.btnSolicitud = function(){
        	$state.go('tab.solici');
        }

        if(id){
	        $scope.cargarMensajes = function(){
	        	restApi.call({
					method: 'get',
					url: 'mensaje/listarRes/'+ $scope.tokn1 ,
					response: function (resp) {
					    $scope.mensajesRes = resp;  
					    if(!id){
					    	clearInterval(intervalo);
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
    	}

        var intervalo = setInterval($scope.cargarMensajes, 1000);

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
    	

		//ENVIAR MENSAJE
		if(id){
			restApi.call({
				method: 'get',
				url: 'contactos/obtener/'+ id ,
				response: function (resp) {
				    tokn2 = resp.tokenUser2; 
				    $scope.nombre = auth.getTokenData(tokn2).nombre; 
				},
				error: function (err) {
				    console.log(err);
				},
				validationError: function (valid) {
				    console.log(valid);
				}
			});

		}
		$scope.verifi = {
			tokenEmisor: undefined,
			tokenReceptor: undefined,
			mensaje:  undefined
		}

		$scope.btnEnviarMensaje = function(){
			
			var data = {
				tokenEmisor: $scope.tokn1,
				tokenReceptor: tokn2,
				mensaje: $scope.verifi.mensaje
			}

			restApi.call({
				method: 'post',
				url: 'mensaje/enviar',
				data: data,
				response: function (resp) {

					if(resp.message == 'El mensaje ha sido enviado'){
			    		$scope.verifi.mensaje = undefined;
			    		$scope.mensajesEms.push(resp.data);
			    	}   

			    	if(resp.message == 'No se puede enviar el mensaje'){
			    		$scope.verifi.mensaje = undefined;
			    		navigator.notification.confirm(resp.message, function(){
                        }, "Error", ["Aceptar"]);
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

		//LEER MENSAJES
		$scope.mostrarMensajes = function(){
			
	    	restApi.call({
				method: 'get',
				url: 'mensaje/listarEmi/'+ $scope.tokn1 ,
				response: function (resp) {
				    $scope.mensajesEms = resp;   
				},
				error: function (err) {
				    console.log(err);
				},
				validationError: function (valid) {
				    console.log(valid);
				}
			});

	    	
			restApi.call({
				method: 'get',
				url: 'mensaje/listarRes/'+ $scope.tokn1 ,
				response: function (resp) {
				    $scope.mensajesRes = resp;   
				},
				error: function (err) {
				    console.log(err);
				},
				validationError: function (valid) {
				    console.log(valid);
				}
			});
		}

		$scope.cargar = function(){
            $scope.mostrarMensajes();
            $scope.mostrarContactos();
            $scope.$broadcast('scroll.refreshComplete'); 
        }

    }]);

}());  