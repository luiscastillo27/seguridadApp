(function(){

    var app = angular.module('starter.services', []);

    var URLBase = 'http://192.168.0.10/~Luis/seguridadWS/public/';

    app.factory('auth', ['$location', function ($location) {
        var auth = {
            setToken: function (token) {
                localStorage["APP-TOKEN"] = token;
            },
            getToken: function () {
                return localStorage["APP-TOKEN"];
            },
            getUserData: function () {
                try{
                    var token = localStorage["APP-TOKEN"];
                    if (token === '') return;
                    var base64Url = token.split('.')[1];
                    var base64 = base64Url.replace('-', '+').replace('_', '/');
                    return JSON.parse(window.atob(base64));                
                } catch(err) {
                    $location.path('/');
                }
            },
            getTokenData: function (tkn) {
                try{
                    var token = tkn;
                    var base64Url = token.split('.')[1];
                    var base64 = base64Url.replace('-', '+').replace('_', '/');
                    return JSON.parse(window.atob(base64)).data;                
                } catch(err) {
                    $location.path('/');
                }
            },
            logout: function () {
                localStorage["APP-TOKEN"] = '';
                $location.path('/login');
            },
            hasToken: function () {
                return (localStorage["APP-TOKEN"] !== '');
            },
            redirectIfNotExists: function () {
                if (!auth.hasToken()) {
                    $location.path('/login');
                }
            },
            getType: function () {
                var tipo = auth.getUserData().tipo;
                return tipo;
            }
            
        };

        return auth;
    }]);


    app.service('restApi', ['$http', 'auth', function ($http, auth) {
        this.call = function (config) {
            var headers = {};
            headers["APP-TOKEN"] = auth.getToken();

            var http_config = {
                method: config.method,
                url: URLBase + config.url,
                data: typeof (config.data) === 'undefined' ? null : config.data,
                headers: headers
            };

            $http(http_config).then(function successCallback(response) {
           
                config.response(response.data);
            }, function errorCallback(response) {
                

                switch (response.status) {
                    case 401: // No autorizado
                        auth.logout();
                        break;
                    case 422: // Validación
                        config.validationError(response.data);
                        break;
                    default:
                        config.error(response);
                        console.log(response.statusText);
                        break;
                }
            });
        };
    }]);

    app.service('restApiImg', ['$http',  'auth', function ($http,  auth) {
        this.call = function (config) {
            var token = auth.getToken();
            var headers = {
                "Content-type": undefined,
                "APP-TOKEN": token
            }

            var http_config = {
                method: config.method,
                url: URLBase + config.url,
                data: typeof (config.data) === 'undefined' ? null : config.data,
                headers: headers,
                transformRequest: angular.identity
            };

            $http(http_config).then(function successCallback(response) {
                config.response(response.data);
            }, function errorCallback(response) {
           

                switch (response.status) {
                    case 401: // No autorizado
                        auth.logout();
                        break;
                    case 422: // Validación
                        config.validationError(response.data);
                        break;
                    default:
                        config.error(response);
                        console.log(response.statusText);
                        break;
                }
            });
        };
    }]);
    
    app.factory('locStr', ['$location', function ($location) {
         //-----------------------------FUENTES-----------------------------
            return {
                listarFuente: function(){
                  return localStorage['fuentes'];
                },
                crearFuente: function(fuente){
                    localStorage['fuentes'] = fuente;
                },
                eliminarFuente: function(){
                    return localStorage['fuentes'] = '';
                }
            };

            //-----------------------------HISTORIAS-----------------------------
            var categorias = angular.fromJson(window.localStorage['categorias'] || '[]');
            function CateLS(){
                window.localStorage['categorias'] = angular.toJson(categorias);
            }
            return {
                listarCate: function(){
                  return categorias;
                },
                obtenerCate: function(id){
                    return categorias.filter(function(categoria){
                        return categoria.id_alab === id;
                    })[0];
                },
                crearCate: function(categoria){
                  categorias.push(categoria);
                  CateLS();
                },
                actualizarCate: function(categoria){
                  for (var i = 0; i < categorias.length; i++) {
                        if(categorias[i].id_alab === categoria.id_alab){
                          categorias[i] = categoria;
                          CateLS();
                          return;
                        }
                    }
                },
                eliminarCate: function(id){
                    for (var i = 0; i < categorias.length; i++) {
                        if(categorias[i].id_alab === id){
                          categorias.splice(i, 1);
                          CateLS();
                          return;
                        }
                    }
                }
            }
    }]);

}());