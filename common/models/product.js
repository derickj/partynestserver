module.exports = function(Product) {
//Product.disableRemoteMethod('create', true);                // Removes (POST) /products
Product.disableRemoteMethod('upsert', true);                // Removes (PUT) /products
//Product.disableRemoteMethod('deleteById', true);            // Removes (DELETE) /products/:id
Product.disableRemoteMethod('replaceById', true);            // Removes (PUT) /products/:id
// Product.disableRemoteMethod('replaceOrCreate', true);            // Removes (POST) /replaceOrCreate
Product.disableRemoteMethod("updateAll", true);               // Removes (POST) /products/update
Product.disableRemoteMethod("updateAttributes", false);       // Removes (PUT) /products/:id
Product.disableRemoteMethod('createChangeStream', true);    // removes (GET|POST) /products/change-stream
//Product.disableRemoteMethod('__get__tags', false);
//Product.disableRemoteMethod('__create__reviews', false);
Product.disableRemoteMethod('__delete__reviews', false);
Product.disableRemoteMethod('__upsert__reviews', true);  
Product.disableRemoteMethod('__replaceById__reviews', true);  
};
