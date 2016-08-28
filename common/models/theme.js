module.exports = function(Theme) {
Theme.disableRemoteMethod('upsert', true); 
Theme.disableRemoteMethod('createChangeStream', true); 
Theme.disableRemoteMethod('replaceById', true);   
Theme.disableRemoteMethod("updateAttributes", false);  
//Theme.disableRemoteMethod('__deleteById__products', false);
//Theme.disableRemoteMethod('__replaceById__products', false);
};
