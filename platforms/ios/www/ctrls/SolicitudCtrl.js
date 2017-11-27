(function(){
    
    var app = angular.module('SolicitudCtrl', []);

    app.controller('SolicitudCtrl', ['$scope', 'restApi', 'locStr', '$state', 'auth', '$ionicPopup' , '$stateParams', function ($scope, restApi, locStr, $state, auth, $ionicPopup, $stateParams) {
        
    	auth.redirectIfNotExists();
    	var tokn1 = auth.getToken();
    	var id = $stateParams.id;
    	var hash = "";
    	
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

	     	restApi.call({
				method: 'post',
				url: 'solicitud/aceptar',
				data: data,
				response: function (resp) { 
					navigator.notification.confirm(resp.message, function(){
                    }, "Exito", ["Aceptar"]);
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