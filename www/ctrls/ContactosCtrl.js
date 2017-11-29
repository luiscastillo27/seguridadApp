(function(){
    
    var app = angular.module('ContactosCtrl', []);

    app.controller('ContactosCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicLoading' , '$stateParams', 'restApiImg', function ($scope, restApi, locStr, $state, auth, $ionicLoading, $stateParams, restApiImg) {
        
        
        auth.redirectIfNotExists();
        $scope.tokn1 = auth.getToken();
        var id = $stateParams.id;
        $scope.mensajesEms = [];
        $scope.mensajesRes = [];
        var tokn2 = "";
        $scope.URLBase = 'http://192.168.0.10/~Luis/seguridadWS/public/archivos/';


        $scope.show = function() {
            $ionicLoading.show({
                template: 'Comprobando mensaje...'
            }).then(function(){

            });
       	}

        $scope.hide = function(){
            $ionicLoading.hide().then(function(){
                           
            });
        };

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
			mensaje:  undefined,
			archivo: undefined
		}



		$scope.btnEnviarMensaje = function(){
			
			var data = {
				tokenEmisor: $scope.tokn1,
				tokenReceptor: tokn2,
				mensaje: $scope.verifi.mensaje
			}

			$scope.show();
			restApi.call({
				method: 'post',
				url: 'mensaje/enviar',
				data: data,
				response: function (resp) {

					if(resp.message == 'El mensaje ha sido enviado'){
			    		
			    		setTimeout(function(){

			    			$scope.hide();
			    			$scope.verifi.mensaje = undefined;
			    			$scope.mensajesEms.push(resp.data);

			    			navigator.notification.confirm(tokn2, function(){
                        	}, "Hash del Mensaje", ["Aceptar"]);

				            navigator.notification.confirm($scope.tokn1, function(){
                        	}, "Hash de la Autoridad Certificadora", ["Aceptar"]);

			    		}, 4000);
			    			
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


		//BOTON PARA ENVIAR IMAGENES
		$scope.btnAbirArchivo = function(){
			$("#agregarArchivo").click();
		}
		
		//ENVIAR IMAGENES
		$scope.enviarArchivo = function(event){
			var files = event.target.files;
            var file = files[files.length-1];
            $scope.verifi.archivo = file;

            var archivo = $scope.verifi.archivo;
            var tokenReceptor = tokn2;
            var tokenEmisor = $scope.tokn1;
            var formData = new FormData();
            formData.append("archivo", archivo);
            formData.append("tokenReceptor", tokenReceptor);
            formData.append("tokenEmisor", tokenEmisor);

            $scope.show();
			restApiImg.call({
				method: 'post',
				url: 'mensaje/archivos',
				data: formData,
				response: function (resp) {

					console.log(resp);
					if(resp.message == 'El archivo ha sido enviado'){
			    		
			    		setTimeout(function(){

			    			$scope.hide();
			    			$scope.mostrarMensajes();

			    			navigator.notification.confirm(tokenReceptor, function(){
                        	}, "Hash del Mensaje", ["Aceptar"]);

				            navigator.notification.confirm(tokenReceptor, function(){
                        	}, "Hash de la Autoridad Certificadora", ["Aceptar"]);

                        	//$state.go('tab.contactos');

			    		}, 4000);
			    			
			    	}   
			    	if(resp.message == 'No se puede enviar el archivo'){
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
					console.log(resp);
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

		$scope.mostrarMensajes();

		$scope.cargar = function(){
            $scope.mostrarMensajes();
            $scope.mostrarContactos();
            $scope.$broadcast('scroll.refreshComplete'); 
        }

    }]);

}());  