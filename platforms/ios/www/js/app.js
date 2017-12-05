(function(){

    var app = angular.module('starter', ['ionic', 'ngCordova','starter.services', 'ContactosCtrl', 'AjustesCtrl', 'LoginCtrl',
      'SolicitudCtrl', 'TokenCtrl', 'MensajeCtrl'])

    app.run(function($ionicPlatform) {

        $ionicPlatform.ready(function() {

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
              cordova.plugins.Keyboard.disableScroll(true);
            }

            if(window.cordova && window.cordova.InAppBrowser){
              window.open = cordova.InAppBrowser.open;
            }

            if (window.StatusBar) {
              StatusBar.styleDefault();
            }

            localStorage["base_url"] = 'http://192.168.0.10/~Luis/seguridadWS/public/';
  
        });

    })

    app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

      $ionicConfigProvider.tabs.position('bottom');

      $stateProvider.state('login', {
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
      })

      $stateProvider.state('crear-cuenta', {
          url: '/crear-cuenta',
          templateUrl: 'templates/crear-cuenta.html',
          controller: 'LoginCtrl'
      })

      $stateProvider.state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      $stateProvider.state('tab.contactos', {
        url: '/contactos',
        views: {
          'tab-contactos': {
            templateUrl: 'templates/tab-contactos.html',
            controller: 'ContactosCtrl'
          }
        }
      })

      $stateProvider.state('tab.contactos-escribir', {
        url: '/contactos/:id',
        views: {
          'tab-contactos': {
            templateUrl: 'templates/tab-contactos-escribir.html',
            controller: 'MensajeCtrl'
          }
        }
      })

      $stateProvider.state('tab.contactos-token', {
        url: '/contactos/token/:id',
        views: {
          'tab-contactos': {
            templateUrl: 'templates/tab-contactos-token.html',
            controller: 'TokenCtrl'
          }
        }
      })

      $stateProvider.state('tab.solici', {
        url: '/solici',
        views: {
          'tab-contactos': {
            templateUrl: 'templates/tab-solic.html',
            controller: 'SolicitudCtrl'
          }
        }
      })

      $stateProvider.state('tab.solicitud', {
          url: '/solicitud',
          views: {
            'tab-solicitud': {
              templateUrl: 'templates/tab-solicitud.html',
              controller: 'SolicitudCtrl'
            }
          }
      })

      $stateProvider.state('tab.solicitud-aceptar', {
          url: '/solicitud/aceptar/:id',
          views: {
            'tab-solicitud': {
              templateUrl: 'templates/tab-solicitud-aceptar.html',
              controller: 'SolicitudCtrl'
            }
          }
      })

      $stateProvider.state('tab.ajustes', {
        url: '/ajustes',
        views: {
          'tab-ajustes': {
            templateUrl: 'templates/tab-ajustes.html',
            controller: 'AjustesCtrl'
          }
        }
      });

      $urlRouterProvider.otherwise('/login');

    });

}()); 