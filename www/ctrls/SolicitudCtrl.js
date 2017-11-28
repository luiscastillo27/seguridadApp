(function(){
    
    var app = angular.module('SolicitudCtrl', []);

    app.controller('SolicitudCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicLoading' , '$stateParams', function ($scope, restApi, locStr, $state, auth, $ionicLoading, $stateParams) {
        
    	auth.redirectIfNotExists();
    	var tokn1 = auth.getToken();
    	var id = $stateParams.id;
    	var hash = "";

    	$scope.show = function() {
            $ionicLoading.show({
                template: 'Comprobando solicitud...'
            }).then(function(){

            });
       	}

        $scope.hide = function(){
            $ionicLoading.hide().then(function(){
                           
            });
        };
    	
    	//MOSTRAR TODAS LAS SOLICITUDES
    	$scope.mostrar = function(){

    		$scope.solicitudes = [];
	    	restApi.call({
				method: 'get',
				url: 'solicitud/listar/'+ tokn1 ,
				response: function (resp) {
				    $scope.solicitudes = resp;   
				},
				error: function (err) {
				    console.log(err);
				},
				validationError: function (valid) {
				    console.log(valid);
				}
			});
			
    	}
    	
    	//ENVIAR SOLICITUD
    	$scope.verifi = {
    		tokenUser2: undefined
    	}

    	$scope.btnEnviar = function(){

    		var data = {
    			tokenUser1: tokn1,
    			tokenUser2: $scope.verifi.tokenUser2,
    		}
   
    		restApi.call({
			    method: 'post',
			    url: 'solicitud/enviar',
			    data: data,
			    response: function (resp) {


			    	if(resp.message == 'Solicitud enviada'){
			    		$scope.verifi.tokenUser2 = undefined;

			    		navigator.notification.confirm(tokn1, function(){
                        }, "Hash del Solicitado", ["Aceptar"]);

				        navigator.notification.confirm(tokn1, function(){
                       	}, "Hash de la Autoridad Certificadora", ["Aceptar"]);

			    		navigator.notification.confirm(resp.message, function(){
                        }, "Correcto", ["Aceptar"]);
			    	} 
			    	if(resp.message == 'Ya existe la solicitud'){
			    		$scope.verifi.tokenUser2 = undefined;
				    	navigator.notification.confirm(resp.message, function(){
                        }, "Alerta", ["Aceptar"]);
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
    	
    	//OBTENER SOLICITUD
    	if(id){
    		restApi.call({
				method: 'get',
				url: 'solicitud/obtener/'+ id ,
				response: function (resp) { 
				    hash = resp.tokenUser1;
				    $scope.nombre = auth.getTokenData(hash).nombre;
				    $scope.telefono = auth.getTokenData(hash).telefono; 
				},
				error: function (err) {
				    console.log(err);
				},
				validationError: function (valid) {
				    console.log(valid);
				}
			});
    	}
    	
    	//ACEPTAR SOLICITUD
    	$scope.aceptar = function(){

    		var data = {
	    		tokenUser1: tokn1,
	   			tokenUser2: hash
	   		}
	   		$scope.show();
	     	restApi.call({
				method: 'post',
				url: 'solicitud/aceptar',
				data: data,
				response: function (resp) { 

					setTimeout(function(){

						$scope.hide();

						navigator.notification.confirm(hash, function(){
                        }, "Hash del Solicitado", ["Aceptar"]);

				        navigator.notification.confirm(tokn1, function(){
                       	}, "Hash de la Autoridad Certificadora", ["Aceptar"]);

                       	navigator.notification.confirm(resp.message, function(){
	                    }, "Exito", ["Aceptar"]);

	                  
                    }, 3000);

				},
				error: function (err) {
				    console.log(err);
				},
				validationError: function (valid) {
				    console.log(valid);
				}
			});

    	}

    	$scope.mostrar();

    	$scope.cargar = function(){
            $scope.mostrar();
            $scope.$broadcast('scroll.refreshComplete'); 
        }

    }]);

}());  