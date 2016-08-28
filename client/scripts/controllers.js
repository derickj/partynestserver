'use strict';

// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('partyNestApp')
  .controller('IndexController', ['$scope', '$state', 'Message', function($scope,
      $state, Message) {
      $scope.showMsg = false;
                console.log("In Index Controller");
            Message.findOne()
                .$promise
                .then(function(results) {
                    $scope.message = results;
                    $scope.showMsg = true;
                console.log("Retrieved message ",$scope.message);
            });
  }])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'Customer', 'Role', function ($scope, $state, $rootScope, ngDialog, Customer, Role) {

    $scope.loggedIn = false;
    $scope.username = 'not logged in';
    $scope.isAdminUser = false;
    $scope.admins = {principalid : 0};

    Role.findOne(function (response) {
        console.log ("role found", response);
        if (response.name == "admin"){
            console.log ("admin role found", response.id, response);
            Role.prototype$__get__principals ({id : response.id}, function (principals){
                var cnt = principals.length;
                console.log ("n principals found", cnt, principals);
                $scope.admins.principalId = principals[0].principalId;
            });
        }
        else {
            console.log ("admin role not found", response);
        }
    });
    
    function testAdminRole (userid) {
        var found = false;
//        var cnt = $scope.admins.length;
//        for (var i = 0; i < cnt + 1; i++)
//        {
            if ($scope.admins.principalId == userid) {
                console.log ("admin user found", $scope.admins.principalId);
                found = true;
//                break;
            }
            else {
                console.log ("admin user not found", $scope.admins.principalId, userid);
            }
//        }
        return (found);
    };
    
    if(Customer.isAuthenticated()) {
        console.log ("Customer is authenticated in HeaderCtrl: ",Customer.getCurrentId());
        $scope.loggedIn = true;
        $scope.username = Customer.getCurrentId();
        $scope.isAdminUser = testAdminRole($scope.username);
    } 
    else
    {
        console.log ("Customer is not authenticated in HeaderCtrl: ");
        $scope.loggedIn = false;
        $scope.username = 'not logged in';
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       Customer.logout();
        $scope.loggedIn = false;
        $scope.username = 'not logged in';
        $scope.isAdminUser = false;
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = true;
        $scope.username = Customer.getCurrentId();
        $scope.isAdminUser = testAdminRole($scope.username);
    });
        
/*    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
*/    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

    .controller('LoginController', ['$scope', '$rootScope', 'ngDialog', 'Customer', function ($scope, $rootScope, ngDialog, Customer) {
    
    /*$scope.loginData = $localStorage.getObject('userinfo','{}'); */
    $scope.loginData = {
      username : "",
      email : "",
      password : "",
      token : ""
    };
    $scope.rememberMe = 0;
    if (Customer.isAuthenticated()) {
        console.log ("LognCtrl Customer is already authenticated: ",Customer.getCurrentId());
        $rootScope.$broadcast('login:Successful');
    }
    else 
    {    
        console.log ("LoginCtrl Not authenticated");
        /* var message = '\
            <div class="ngdialog-message">\
            <div><h3>Login Unsuccessful</h3></div>' +
            '<div class="ngdialog-buttons">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
                    ngDialog.openConfirm({ template: message, plain: 'true'}); */
    }               

    $scope.doLogin = function() {
        Customer.login({ rememberMe: $scope.rememberMe }, $scope.loginData, function(err) {
            if (err)
            {
                console.log ("Result from login is not NULL", err);
                $rootScope.$broadcast('login:Successful');
            }
            else
            {
                console.log ("Err from login is NULL");                
            }
            /* var next = $location.nextAfterLogin || '/';
            $location.nextAfterLogin = null;
            $location.path(next); */

         ngDialog.close();
        });
    };
        
    /*$scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default dialoglarge', controller:"RegisterController" });
    }; */
    
}])
;


