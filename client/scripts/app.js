
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
    
    // route for the wishlist page
    .state('app.wishlist', {
        url:'wishlist',
        views: {
            'content@': {
                templateUrl : 'views/wishlist.html',
                controller  : 'WishlistController'                  
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
    .state('app.homeadm', {
        url:'homeadm',
        views: {
            'content@': {
                templateUrl : 'views/homeadm.html',
                controller  : 'HomeAdmController'                  
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
    
    .state('app.contactadm', {
        url:'contactadm',
        views: {
            'content@': {
                templateUrl : 'views/contactadm.html',
                controller  : 'ContactAdmController'                  
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
    
    // route for the aboutus page
    .state('app.contact', {
        url:'contact',
        views: {
            'content@': {
                templateUrl : 'views/contactus.html',
                controller  : 'ContactController'                  
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


