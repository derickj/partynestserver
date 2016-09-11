'use strict';

// Copyright IBM Corp. 2015. All Rights Reserved.
// Node module: loopback-example-angular
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

angular
  .module('partyNestApp')
  
  .controller('IndexController', ['$scope', '$state', 'Message', 'Featured', 'Product',
                        function($scope, $state, Message, Featured, Product) {
    $scope.showMsg = false;
    $scope.showFeatured = false;
    $scope.featureds = [];
    $scope.featuredmsg = "Loading data ...";
                            
    console.log("In Index Controller");
    Message.findOne()
                .$promise
                .then(function(results) {
                    $scope.message = results;
                    $scope.showMsg = true;
                console.log("Retrieved message ",$scope.message);
    });
    
    function getFeatureds() {
    Featured
        .find({"filter" : {"include" : "product"}})
        .$promise
        .then(function(results) {
            results.forEach(function(obj) {
                if (obj.product.label == " ") {
                    obj.product.label = "";
                }
            });
            $scope.featureds = results;
            $scope.showFeatured = true;
            $scope.featured = $scope.featureds[0].product;
            $scope.featureds.splice(0,1);
            console.log ("Featureds are:",results);
        })
        .catch(function(response) {
          $scope.featuredmsg = "Error: "+response.status + " " + response.statusText;
          console.error('getFeatureds error', response.status, response.data);
        });
    }
    if (!$scope.showFeatured) {
        getFeatureds();
    }                        
                            
  }])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthService', 
                                 function ($scope, $state, $rootScope, ngDialog, AuthService) {

    $scope.loggedIn = false;
    $scope.isAdminUser = false;
    $scope.username = '';
    $scope.userId = '';
  /*  $scope.admins = {principalid : 0};
    
    Role.findOne(function (response) {
        console.log ("role found", response);
        if (response.name == "admin"){
            console.log ("admin role found", response.id, response);
            Role.prototype$__get__principals ({id : response.id}, function (principals){
                var cnt = principals.length;
                console.log ("n principals with admin role found", cnt, principals);
                $scope.admins.principalId = principals[0].principalId;
            });
        }
        else {
            console.log ("admin role not found", response);
        }
    });
                                     
    function testAdminRole (userid) {
        var found = false;
        if ($scope.admins.principalId == userid) {
            console.log ("admin user found", $scope.admins.principalId);
            found = true;
        }
        else {
            console.log ("admin user not found", $scope.admins.principalId, userid);
        }
        return (found);
    };
*/
                                     
    if(AuthService.isAuthenticated()) {
        console.log ("HeaderCtrl Customer is already authenticated: ");
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
        $scope.userId = AuthService.getUserid();
        $scope.isAdminUser = AuthService.testAdminRole($scope.userId);
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthService.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $scope.userId = '';
        $scope.isAdminUser = false;
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
        $scope.userId = AuthService.getUserid();
        $scope.isAdminUser = AuthService.testAdminRole($scope.userId);  
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthService.isAuthenticated();
        if ($scope.loggedIn) {
            $scope.username = AuthService.getUsername();
            $scope.userId = AuthService.getUserid();
        }
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };

/*    $scope.loggedIn = false;
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
    }); */
        
/*    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
*/    
/*    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    }; */
    
}])

    .controller('LoginController', ['$scope', '$rootScope', 'ngDialog', '$localStorage', 'AuthService', 
                function ($scope, $rootScope, ngDialog, $localStorage, AuthService) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}'); 
    /*$scope.loginData = {
      username : "",
      email : "",
      password : "",
      token : ""
    }; 
                 
    $scope.user = {}; */
    $scope.rememberMe = 0;
                    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthService.login($scope.loginData);

        ngDialog.close();

    };
                    
 /*   if (Customer.isAuthenticated()) {
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
    }; */
      
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default dialoglarge', controller:"RegisterController" });
    }; 
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', 'AuthService', 
                                   function ($scope, ngDialog, AuthService) {
 
    $scope.registration={};
    $scope.loginData={};
    
    $scope.doRegister = function() {

        AuthService.register($scope.registration);
        
        ngDialog.close();

    };
                                       
/*    $scope.registration = {};
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
    }; */
                                       
}])

.controller('ProductController', ['$scope', '$state', 'Product', 'Theme', function($scope,
      $state, Product, Theme) {

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

.controller('WishlistController', ['$scope', '$state', '$rootScope', 'AuthService', 'Customer', 'Product', 'Wishlist', 
                                 function ($scope, $state, $rootScope, AuthService, Customer, Product, Wishlist) {

    $scope.loggedIn = false;
    $scope.wishlist = [];
    $scope.nItems = 0;
    $scope.userId = "";

    if (AuthService.isAuthenticated()) {
        console.log ("WishlistCtrl Customer is already authenticated: ");
        $scope.userId = AuthService.getUserid();
        $scope.loggedIn = true;
    }
    else 
    {
        console.log ("Customer is not authenticated in WishlistCtrl: ");
        $scope.loggedIn = false;
    }
        
    $rootScope.$on('logout', function () {
        console.log ("WishlistController Customer is no longer authenticated: ");
        $scope.loggedIn = false;
        $scope.nItems = 0;
        $scope.wishlist = [];
        $scope.userId =  "";
    });
     
                         
    function getWishlist() {
    Customer
        .wishlists({id:$scope.userId, "filter" : {"include" : "product"}})
        .$promise
        .then(function(results) {
            $scope.wishlist = results;
            $scope.nItems = $scope.wishlist.length;
            $scope.showWishlist = true;
            console.log ("Wishlist is:",$scope.wishlist);
        })
        .catch(function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          console.error('getWishlist error', response.status, response.data);
        });
    }
    if ($scope.loggedIn) {                                
        getWishlist();
    }
                                     
    $scope.removeFromWishlist = function(item) {
      Wishlist
        .deleteById({id: item.id})
        .$promise
        .then(function() {
          getWishlist();
        });
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
    $scope.newProduct = {name :"", description: "", label: " ", unitprice: 0, image : ""};
    $scope.canloadfiles = true;
    $scope.filetoobig = false;
    
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

    $scope.updateProduct = function() {
        console.log ("Product to update:",$scope.newProduct);
      Product
        .replaceOrCreate($scope.newProduct)
        .$promise
        .then(function(prod) {
          $scope.newProduct = {name :"", description: "", label: " ", unitprice: 0, image : ""};
          $scope.productForm.productname.$setPristine();
          $('.focus').focus();
          getProducts();
        });
    };
    
    $scope.addProduct = function() {
      Product
        .create($scope.newProduct)
        .$promise
        .then(function(prod) {
          $scope.newProduct = {name :"", description: "", label: " ", unitprice: 0, image : ""};
          $scope.productForm.productname.$setPristine();
          $('.focus').focus();
          getProducts();
        });
    };

    $scope.editProduct = function(item) {
        $scope.newProduct = {name :"", description: "", label: " ",  unitprice: 0, image : ""};
        $scope.newProduct.id = item.id;
        $scope.newProduct.name = item.name;
        $scope.newProduct.description = item.description;
        $scope.newProduct.label = item.label;
        $scope.newProduct.unitprice = item.unitprice;
        $scope.newProduct.image = item.image;
    };
    
    $scope.removeProduct = function(item) {
      Product
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
            if (input.files[0].size > 30000) {
                console.log("File too big: ", input.files[0]);
                $scope.filetoobig = true;
            }
            else {
                $scope.filetoobig = false;                
            }
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

.controller('ProductDetailController', ['$scope', '$rootScope', '$stateParams', 'Product', 'AuthService', 'Wishlist',
                                        function($scope, $rootScope, $stateParams, Product, AuthService, Wishlist) {

    $scope.product = {};
    $scope.reviews = [];
    $scope.showProduct = false;
    $scope.showReviews = false;
    $scope.message="Loading ...";
    $scope.loggedIn = false;
    $scope.userId = "";

    if (AuthService.isAuthenticated()) {
        console.log ("ProductDetailCtl Customer is already authenticated: ");
        $scope.userId = AuthService.getUserid();
        $scope.loggedIn = true;
    }
    else 
    {
        console.log ("Customer is not authenticated in ProductDetailCtrl: ");
        $scope.loggedIn = false;
    }
        
    $rootScope.$on('logout', function () {
        console.log ("ProductDetailCtl Customer is no longer authenticated: ");
        $scope.loggedIn = false;
        $scope.userId =  "";
    });
                                            
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
                                            
    $scope.addToWishlist = function(productid) {
        
      console.log ("adding to customer product ", $scope.userId, productid);
      Wishlist
        .create({customerId: $scope.userId, productId: productid })
        .$promise
        .then(function() {
          console.log ("added to customer product ", $scope.userId, productid);
        })
        .catch(function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          console.error('wishlists.create error', response.status, response.data);
        });;
    };
            
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


.controller('HomeAdmController', ['$scope', '$state', 'Message', 'Featured', 'Product', 
                            function($scope,$state, Message, Featured, Product) {
    
    $scope.showMsg = false;
    $scope.products = [];
    $scope.featureds = [];
    $scope.showProducts = false;
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
     
    function getFeatureds() {
    Featured
        .find()
        .$promise
        .then(function(results) {
          $scope.featureds = results;
          console.log ("Featureds are:",results);
        })
        .catch(function(response) {
          $scope.message = "Error: "+response.status + " " + response.statusText;
          console.error('getFeatureds error', response.status, response.data);
        });
    }
    getFeatureds();
                                
    $scope.removeProduct = function(item) {
      Featured
        .deleteById({id: item.id})
        .$promise
        .then(function() {
          getFeatureds();
        });
    };

    $scope.addProduct = function(item) {
      Product
        .prototype$__create__featured({id: item.id})
        .$promise
        .then(function() {
          getFeatureds();
        });
    };

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

  }])

.controller('ReviewController', ['$scope','$rootScope', '$stateParams', 'Product', 'AuthService', function($scope, $rootScope, $stateParams, Product, AuthService) {
            
    $scope.newcomment = {rating:5, author: "", review:"", productId:"", customerId:""};
    $scope.newcomment.productId = $stateParams.id;    

    $scope.loggedIn = false;

    if (AuthService.isAuthenticated()) {
        $scope.newcomment.customerId = AuthService.getUserid();
        $scope.newcomment.author = AuthService.getUsername();
        console.log ("ReviewCtl Customer is already authenticated: ",$scope.newcomment.customerId);
        $scope.loggedIn = true;
    }
    else 
    {
        console.log ("Customer is not authenticated in ReviewCtrl: ");
        $scope.loggedIn = false;
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
        
        form.$setPristine();
        $scope.newcomment = {rating:5, author: "", review:"", productId:"", customerId:""};
        $scope.newcomment.productId = $stateParams.id;
        $scope.newcomment.customerId = AuthService.getUserid();
        $scope.newcomment.author = AuthService.getUsername();
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = true;
        $scope.newcomment.customerId = AuthService.getUserid();
        $scope.newcomment.author = AuthService.getUsername();
        console.log ("ReviewController Customer is now authenticated: ",$scope.newcomment.customerId);
    });
    
    $rootScope.$on('logout', function () {
        $scope.loggedIn = false;
        console.log ("ReviewController Customer is no longer authenticated: ");
        $scope.newcomment.customerId =  "";
    });
}])

.controller('ContactController', ['$scope', '$rootScope', 'Contact', 'AuthService',
                                  function ($scope, $rootScope, Contact, AuthService) {

    $scope.loggedIn = false;
    $scope.feedback = {
        mychannel: "email",
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
        value: "email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    if (AuthService.isAuthenticated()) {
        $scope.feedback.firstName = AuthService.getUsername();
        console.log ("ContactCtl Customer is already authenticated: ",$scope.feedback.firstName);
        $scope.loggedIn = true;
    }
    else 
    {
        console.log ("Customer is not authenticated in ContactCtrl: ");
        $scope.loggedIn = false;
    }
                                      
    $scope.sendFeedback = function () {
        console.log('Trying to create ', $scope.feedback);
        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            /* Contact
                .create($scope.feedback)
                .$promise
                .then(function(result) {
                    $scope.feedback = {
                                mychannel: "email",
                                firstName: "",
                                lastName: "",
                                agree: false,
                                email: "",
                                telno: "",
                                feedback : ""
                    };
                    console.log ("CLearing form successful create..");
                    $scope.feedbackForm.$setPristine();
                    $('.focus').focus(); 
                })
                .catch(function(response) {
                    $scope.message = "Error: "+response.status + " " + response.statusText;
                    console.error('create Contact error', response.status, response.data);
                }); */
            Contact.create($scope.feedback);
            $scope.feedback = {
                                mychannel: "email",
                                firstName: "",
                                lastName: "",
                                agree: false,
                                email: "",
                                telno: "",
                                feedback : "" 
            };
            console.log ("CLearing form ..");
            $scope.feedbackForm.$setPristine();
            $('.focus').focus();  
        }
        //contactForm.$setPristine();
    };
    
/*    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
        $scope.feedback.firstname = $scope.username;
        console.log ("ContactCtrl received login broadcast",$scope.username); 
    });
    
    $rootScope.$on('logout', function () {
        $scope.loggedIn = false;
        console.log ("ContactCtrl Customer is no longer authenticated: ");
        $scope.feedback.firstname = "";
        $scope.username = "";
    });
    */
}])

;


