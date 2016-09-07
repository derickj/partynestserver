'use strict';

angular
  .module('partyNestApp')
  .factory('AuthService', ['Customer', '$q', '$rootScope', 'ngDialog', 
                           function(Customer, $q, $rootScope, ngDialog) {
    function login(loginData) {
      return Customer
        .login(loginData)
        .$promise
        .then(function(response) {
          console.log ("AuthService login successful: ", response);
          $rootScope.currentUser = {
            id: response.user.id,
            tokenId: response.id,
            username: loginData.username
          };
          $rootScope.$broadcast('login:Successful');
        },
        function(response){

          var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.error.message + '</p><p>' +
                    response.data.error.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
        });
    }
      
    function isAuthenticated() {
        if ($rootScope.currentUser) {
            return true;
        }
        else{
            return false;
        }
    }

    function getUserid() {
        return $rootScope.currentUser.id;
    }
      
    function getUsername() {
        return $rootScope.currentUser.username;
    }

    function logout() {
      return Customer
       .logout()
       .$promise
       .then(function() {
         $rootScope.currentUser = null;
          $rootScope.$broadcast('logout');
       });
    }

   function register(registerData) {
      return Customer
        .create(registerData
        /*  {
         username: registerData.username,
         email: registerData.email,
         password: registerData.password
       } */
      )
       .$promise
      .then (function(result) {
          console.log('Registered succesful', result);
          /*$rootScope.currentUser = {
            id: result.id,
            username: result.username
          }; */
          $rootScope.$broadcast('registration:Successful');
        },
        function(response){
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.error.message + 
                  '</p><p>' + response.data.error.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

        });
    }

    return {
      login: login,
      logout: logout,
      register: register,
      isAuthenticated: isAuthenticated,
      getUsername: getUsername,
      getUserid: getUserid
    };
  }])

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])
;
