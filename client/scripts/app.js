
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
    
    // route for the products page
    .state('app.products', {
        url:'products',
        views: {
            'content@': {
                templateUrl : 'views/products.html',
                controller  : 'ProductController'                  
            }
        }
    })
    
    // routes for the admin pages
    .state('app.themeadm', {
        url:'themeadm',
        views: {
            'content@': {
                templateUrl : 'views/themeadm.html',
                controller  : 'ThemeController'                  
            }
        }
    })
    .state('app.admin', {
        url:'admin',
        views: {
            'content@': {
                templateUrl : 'views/themeadm.html',
                controller  : 'ThemeController'                  
            }
        }
    })    
    .state('app.productadm', {
        url:'productadm',
        views: {
            'content@': {
                templateUrl : 'views/productadm.html',
                controller  : 'ProductAdmController'                  
            }
        }
    })
              
    // route for the product detail page
    .state('app.productdetail', {
        url: 'detail/:id',
        views: {
            'content@': {
                templateUrl : 'views/productdetail.html',
                controller  : 'ProductDetailController'
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


