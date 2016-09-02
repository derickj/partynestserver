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
    $scope.username = '...';
    $scope.isAdminUser = false;
    $scope.admins = {principalid : 0};
    $scope.userId = 0;

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
    if (Customer.isAuthenticated()) {
        console.log ("HeaderCtrl Customer is already authenticated: ");
        $scope.userId = Customer.getCurrentId();
        $scope.user = Customer.getCurrent(function(value,response){
            console.log ("HeaderCtrl getCurrent",value);
            $scope.username = value.username;
        },
        function(err) {
            console.log ("HeaderCtrl getCurrent err",err);
        });
        $rootScope.$broadcast('login:Successful');
        $scope.isAdminUser = testAdminRole($scope.userId);
        $scope.loggedIn = true;
    }
    else 
    {
        console.log ("Customer is not authenticated in HeaderCtrl: ");
        $scope.loggedIn = false;
        $scope.username = '...';
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
        Customer.logout();
        $rootScope.$broadcast('logout');
        $scope.loggedIn = false;
        $scope.username = '...';
        $scope.isAdminUser = false;
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = true;
        $scope.user = Customer.getCachedCurrent();
        $scope.username = $scope.user.username;
        console.log ("HeaderCtrl received login broadcast",$scope.user);
        $scope.isAdminUser = testAdminRole($scope.user.id);
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

    .controller('LoginController', ['$scope', '$rootScope', '$location', 'ngDialog', 'Customer', 
                function ($scope, $rootScope, $location, ngDialog, Customer) {
    
    /*$scope.loginData = $localStorage.getObject('userinfo','{}'); */
    $scope.loginData = {
      username : "",
      email : "",
      password : "",
      token : ""
    };
    $scope.user = {};
    $scope.rememberMe = 0;
    if (Customer.isAuthenticated()) {
        $scope.user = Customer.getCachedCurrent();
        console.log ("LognCtrl Customer is already authenticated: ", $scope.user);
        $rootScope.$broadcast('login:Successful');
    }
    else 
    {    
        console.log ("LoginCtrl Not authenticated");
        
    }               

    $scope.doLogin = function() {
        $scope.user = Customer.login({ rememberMe: $scope.rememberMe, include: 'user' }, $scope.loginData, function(value,response) {
            console.log ("Login is not NULL", value, response);
            $scope.user = value.user;
            $rootScope.$broadcast('login:Successful');
            var next = $location.nextAfterLogin || '/';
            $location.nextAfterLogin = null;
            $location.path(next); 
            ngDialog.close();
        },
        function(err){  
            if (err)
            {
                console.log ("Error logging in", err);
            }
            else
            {
                console.log ("Err from login is NULL");                
            }
            var message = '\
            <div class="ngdialog-message">\
            <div><h4>Login unsuccessful</h4></div><div><p>' +
            err.statusText + '</p></div>' +
            '<div class="ngdialog-buttons">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
                    ngDialog.openConfirm({ template: message, plain: 'true'});
        });
    };
        
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default dialoglarge', controller:"RegisterController" });
    }; 
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', 'Customer', 
                                   function ($scope, ngDialog, Customer) {
    
    $scope.registration = {};
    $scope.loginData = {};
    
    $scope.doRegister = function() {
        $scope.registration.username = $scope.registration.email;
        console.log('Doing registration', $scope.registration);
        Customer
            .create($scope.registration)
        .$promise
        .then(function(result) {
            $scope.registration = {};
            $scope.loginData = {};
            console.log('Registered succesful', result);
        })
        .catch(function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          console.error('doRegister error', response.status, response.data);
          var message = '\
            <div class="ngdialog-message">\
            <div><h4>Registration unsuccessful</h4></div><div><p>' +
            response.statusText + '</p></div>' +
            '<div class="ngdialog-buttons">\
                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
                    ngDialog.openConfirm({ template: message, plain: 'true'});
        });
        ngDialog.close();
    };
}])

.controller('ProductController', ['$scope', '$state', 'Product', 'Theme', function($scope,
      $state, Product, Theme) {
    $scope.tab = 1;
    $scope.filtText = "";
    $scope.showDetails = false;
    $scope.showProducts = false;
    $scope.emptyWislist = false;
    $scope.message = "Loading ...";
    $scope.products = [];
    $scope.themes = [];
    
    $scope.updateFilter = function(txt) {
        $scope.filtText = txt;
        console.log ("New filttext",$scope.filtText);
    };
    
    function getThemes() {
      Theme
        .find()
        .$promise
        .then(function(results) {
          $scope.themes = results;
        });
    }
    getThemes();
    
    function getProducts() {
      Product
        .find()
        .$promise
        .then(function(results) {
          $scope.products = results;
          $scope.showProducts = true;
          console.log ("Products are:",results);
        })
        .catch(function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          console.error('getProducts error', response.status, response.data);
        });
    }
    getProducts();
   
    $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
    };
      
  }])

.controller('ThemeController', ['$scope', '$state', 'Theme', function($scope,
      $state, Theme) {
    $scope.themes = [];
    $scope.newTheme = '';
    
    function getThemes() {
      Theme
        .find()
        .$promise
        .then(function(results) {
          $scope.themes = results;
        });
    }
    getThemes();

    $scope.addTheme = function() {
      Theme
        .create($scope.newTheme)
        .$promise
        .then(function(theme) {
          $scope.newTheme = '';
          $scope.themeForm.themename.$setPristine();
          $('.focus').focus();
          getThemes();
        });
    };

    $scope.removeTheme = function(item) {
      Theme
        .deleteById({id: item.id})
        .$promise
        .then(function() {
          getThemes();
        });
    };
  }])

.controller('ProductAdmController', ['$scope', '$state', 'Product', function($scope,
      $state, Product) {
    $scope.products = [];
    $scope.newProduct = {name :"", description: "", unitprice: 0, image : ""};
    $scope.canloadfiles = true;
    
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        console.log("The File APIs are not fully supported in the browser.");
        $scope.canloadfiles = false;
    }

    function getProducts() {
    Product
        .find()
        .$promise
        .then(function(results) {
          $scope.products = results;
          $scope.showProducts = true;
          console.log ("Products are:",results);
        })
        .catch(function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          console.error('getProducts error', response.status, response.data);
        });
    }
    getProducts();

    $scope.addProduct = function() {
      Product
        .create($scope.newProduct)
        .$promise
        .then(function(prod) {
          $scope.newProduct = {name :"", description: "", unitprice: 0, image : ""};
          $scope.productForm.productname.$setPristine();
          $('.focus').focus();
          getProducts();
        });
    };

    $scope.removeProduct = function(item) {
      Theme
        .deleteById({id: item.id})
        .$promise
        .then(function() {
          getProducts();
        });
    };
    
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                 console.log ("Change image to",e.target);
                $scope.newProduct.image = e.target.result;
                $('#blah').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    };
    
    $("#productImage").change(function(){
        readURL(this);
        console.log ("New product", $scope.newProduct);
    });
    
/*    $imageData = base64_encode(file_get_contents($image));
$scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
// Format the image SRC:  data:{mime};base64,{data};
$src = 'data: '.mime_content_type($image).';base64,'.$imageData;

// Echo out a sample image
echo '<img src="'.$src.'">'; */
    
  }])

.controller('ProductDetailController', ['$scope', '$stateParams', 'Product', function($scope, $stateParams, Product) {

    $scope.product = {};
    $scope.reviews = [];
    $scope.showProduct = false;
    $scope.showReviews = false;
    $scope.message="Loading ...";
    
    function getProduct() {
    Product
        .findById({id:$stateParams.id})
        .$promise
        .then(function(results) {
          $scope.product = results;
            if ($scope.product.label == " ") {
                $scope.product.label = "";
            }
          $scope.showProduct = true;
          console.log ("Product is:",$scope.product);
        })
        .catch(function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          console.error('getProduct error', response.status, response.data);
        });
    }
    getProduct();
    
    function getReviews() {
    Product
        .reviews({id:$stateParams.id})
        .$promise
        .then(function(results) {
            $scope.reviews = results;
            $scope.showReviews = true;
            console.log ("Reviews are:",$scope.reviews);
        })
        .catch(function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          console.error('getReviews error', response.status, response.data);
        });
    }
    getReviews();
    
}])

.controller('ContactAdmController', ['$scope', '$state', 'Contact', function($scope,
      $state, Contact) {
    $scope.contacts = [];
    $scope.newContact = '';
    
    function getContacts() {
      Contact
        .find()
        .$promise
        .then(function(results) {
          $scope.contacts = results;
        });
    }
    getContacts();

    $scope.removeContact = function(item) {
      Contact
        .deleteById({id: item.id})
        .$promise
        .then(function() {
          getContacts();
        });
    };
  }])


.controller('HomeAdmController', ['$scope', '$state', 'Message', 'Featured', function($scope,
      $state, Message, Featured) {
    
    $scope.showMsg = false;
    console.log("Home Adm Controller");
    
    function getMsg() {
        Message.findOne()
            .$promise
            .then(function(results) {
                $scope.message = results;
                $scope.showMsg = true;
                console.log("Retrieved message ",$scope.message);
            });
    } 
    getMsg();
    
    $scope.updateMsg = function() { 
        console.log("Attempting to update message to ",$scope.message);
      Message
        .replaceOrCreate({id: $scope.message.id, msgkey:0, msg: $scope.message.msg})
        .$promise
        .then(function() {
          console.log("Updated message to ",$scope.message);
        })
        .catch(function(response) {
          $scope.message.msg = "Error: "+response.status + " " + response.statusText;
          console.error('updateMsg error', response.status, response.data);
        });        
    };

  }])

.controller('ReviewController', ['$scope','$rootScope', '$stateParams', 'Product', 'Customer', function($scope, $rootScope, $stateParams, Product, Customer) {
            
    $scope.newcomment = {rating:5, review:"", productId:"", customerId:""};
    $scope.newcomment.productId = $stateParams.id;    

    $scope.loggedIn = false;
    
    if (Customer.isAuthenticated()) {
        $scope.newcomment.customerId = Customer.getCurrentId();
        console.log ("LognCtrl Customer is already authenticated: ",$scope.newcomment.customerId);
        $scope.loggedIn = true;
    }
    
    $scope.submitComment = function (form) {
        console.log($scope.newcomment);
        Product
        .reviews.create({id:$stateParams.id},$scope.newcomment)
        .$promise
        .then(function(results) {
            $scope.reviews = results;
            $scope.showReviews = true;
            console.log ("Reviews are:",$scope.reviews);
        })
        .catch(function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          console.error('createReview error', response.status, response.data);
        });
        
        //$scope.dish.comments.push($scope.newcomment);
        //menuFactory.getDishes().update({id:$scope.dish.id},$scope.dish);
        form.$setPristine();
        $scope.newcomment = {rating:5, review:"", productId:"", customerId:""};
        $scope.newcomment.productId = $stateParams.id;
        $scope.newcomment.customerId = Customer.getCurrentId();
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = true;
        console.log ("ReviewController Customer is now authenticated: ",$scope.newcomment.customerId);
        $scope.newcomment.customerId =  Customer.getCurrentId();
    });
    
    $rootScope.$on('logout', function () {
        $scope.loggedIn = false;
        console.log ("ReviewController Customer is no longer authenticated: ");
        $scope.newcomment.customerId =  "";
    });
}])

.controller('ContactController', ['$scope', '$rootScope', 'Contact', 
                                  function ($scope, $rootScope, Contact) {

    $scope.loggedIn = false;
    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: "",
        telno : "",
        feedback : ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.sendFeedback = function () {
        console.log('Trying to create ', $scope.feedback);
        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            Contact
                .create($scope.feedback)
                .$promise
                .then(function(result) {
                    $scope.feedback = {
                                mychannel: "",
                                firstName: "",
                                lastName: "",
                                agree: false,
                                email: "",
                                telno: "",
                                feedback : ""
                    };
                    $scope.feedbackForm.$setPristine();
                    $('.focus').focus();       
                })
                .catch(function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                    console.error('create Contact error', response.status, response.data);
                });
        }
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = true;
        $scope.user = Customer.getCachedCurrent();
        if ($scope.user) {
            $scope.feedback.firstname = $scope.user.username;
            $scope.feedback.email = $scope.user.email;
            console.log ("ContactCtrl received login broadcast",$scope.user);
            
        } else {
            console.log ("ContactCtrl no cached user");            
        }
    });
    
    $rootScope.$on('logout', function () {
        $scope.loggedIn = false;
        console.log ("ContactCtrl Customer is no longer authenticated: ");
        $scope.feedback.firstname = "";
        $scope.feedback.email = "";
    });
}])

;


