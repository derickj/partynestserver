
var partyNestApp = angular
  .module('partyNestApp', [
    'lbServices',
    'ui.router', 
    'ngDialog'
  ]);

partyNestApp.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
    
    // route for the home page
    .state('app', {
        url:'',
        views: {
            'header': {
                templateUrl : 'views/header.html',
                controller  : 'HeaderController' 
            },
            'content': {
                templateUrl : 'views/home.html',
                controller  : 'IndexController'
            },
            'footer': {
                templateUrl : 'views/footer.html'
            }
        }
    })
    
    // route for the aboutus page
    .state('app.aboutus', {
        url:'aboutus',
        views: {
            'content@': {
                templateUrl : 'views/aboutus.html' //,
                // controller  : 'AboutController'                  
            }
        }
    })
    
        // route for the aboutus page
    .state('app.admin', {
        url:'admin',
        views: {
            'content@': {
                templateUrl : 'views/admin.html' //,
                // controller  : 'AboutController'                  
            }
        }
    })
    ;
/*      .state('app', {
        url: '',
        templateUrl: 'views/home.html',
        controller: 'IndexController'
      }); */
    $urlRouterProvider.otherwise('/');
    /* $httpProvider.interceptors.push(function($q, $location, LoopBackAuth) {
        return {
            responseError: function(rejection) {
                if (rejection.status == 401) {
                    //Now clearing the loopback values from client browser for safe logout...
                    LoopBackAuth.clearUser();
                    LoopBackAuth.clearStorage();
                    $location.nextAfterLogin = $location.path();
                    $location.path('/login');
                }
                return $q.reject(rejection);
            }
        };
    }); */ 
    
}]);


