(function(){
    
    var app = angular.module('MensajeCtrl', []);

    app.controller('MensajeCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicLoading' , '$stateParams', 'restApiImg', '$cordovaFileTransfer',function ($scope, restApi, locStr, $state, auth, $ionicLoading, $stateParams, restApiImg, $cordovaFileTransfer) {
        
        
        auth.redirectIfNotExists();
        $scope.tokn1 = auth.getToken();
        var id = $stateParams.id;
        $scope.mensajesEms = [];
        $scope.mensajesRes = [];
        $scope.nombre = '';
        $scope.tokn2 = "";
        $scope.URLBase = localStorage["base_url"];


        $scope.showname = function(){
        	restApi.call({
				method: 'get',
				url: 'contactos/obtener/'+ id ,
				response: function (resp) {
					$scope.tokn2 = resp.tokenUser2; 
					$scope.nombre = auth.getTokenData($scope.tokn2).nombre;
				},
				error: function (err) {
					console.log(err);
				},
				validationError: function (valid) {
					console.log(valid);
				}
			});
        }

        $scope.showname();

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

	    $scope.cargarMensajes = function(){
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
    	

        var intervalo = setInterval($scope.cargarMensajes, 1000);
    	

		//ENVIAR MENSAJE
		$scope.verifi = {
			tokenEmisor: undefined,
			tokenReceptor: undefined,
			mensaje:  undefined,
			archivo: undefined
		}

		$scope.btnEnviarMensaje = function(){
			
			var data = {
				tokenEmisor: $scope.tokn1,
				tokenReceptor: $scope.tokn2,
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

			    			navigator.notification.confirm($scope.tokn2, function(){
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
            var tokenReceptor = $scope.tokn2;
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
            $scope.$broadcast('scroll.refreshComplete'); 
        }

        //ABRIR NAVEGADOR
        $scope.abrirNav = function(url){
        	//window.open($scope.URLBase+'archivos/'+url, '_blank');
        	
			// File for download
			var links = $scope.URLBase+'archivos/'+url;
			console.log(links); 
			// File name only
			var filename = links.split("/").pop();
			 
			// Save location
			var targetPath = cordova.file.externalRootDirectory + filename;
			 
			$cordovaFileTransfer.download(links, targetPath, {}, true).then(function (result) {
			    console.log('Success');
			}, function (error) {
			    console.log('Error');
			}, function (progress) {
				console.log("cargando....");
			});
        }

    }]);

}());  