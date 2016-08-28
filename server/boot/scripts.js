module.exports = function(app) {
var partynestdb = app.dataSources.partynestdb;

partynestdb.autoupdate('Customer', function(err) {
   if (err) throw (err);
   var Customer = app.models.Customer;

    Customer.findOrCreate({ where:{email: 'derick63@gmail.com'}},{username: 'user', email: 'derick63@gmail.com', password: 'abcdef', firstname:'Test', lastname: 'User'}, 
                         function(err,user,created){
        if (err) throw (err);
    });
   Customer.findOrCreate({where:{email: 'jfjordaan@mweb.co.za'}}, {username: 'admin', email: 'jfjordaan@mweb.co.za', password: 'abcdef', firstname: 'Michelle', lastname: 'J' }, 
                         function(err, user) {
    if (err) throw (err);
     var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;

    //create the admin role
    Role.findOrCreate({ where:{name: 'admin'}}, {name: 'admin'}, function(err, role, created) {
        if (err) throw (err);
        //make admin if user was created new, otherwise the RoleMapping shoudl already exist
        if (created)
        {
            role.principals.create({
                principalType: RoleMapping.USER,
                principalId: user.id
            }, function(err, principal) {
                if (err) throw (err);
            });   
        }
    });            
  });  
});

};