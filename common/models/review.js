module.exports = function(Review) {
//Review.disableRemoteMethod('create', true);                // Removes (POST) /Reviews
Review.disableRemoteMethod('upsert', true);                // Removes (PUT) /Reviews
//Review.disableRemoteMethod('deleteById', true);            // Removes (DELETE) /Reviews/:id
//Review.disableRemoteMethod('replaceById', true);            // Removes (PUT) /Reviews/:id
Review.disableRemoteMethod('replaceOrCreate', true);            // Removes (POST) /replaceOrCreate
Review.disableRemoteMethod("updateAll", true);               // Removes (POST) /Reviews/update
//Review.disableRemoteMethod("updateAttributes", false);       // Removes (PUT) /Reviews/:id
Review.disableRemoteMethod('createChangeStream', true);    // removes (GET|POST) /Reviews/change-stream
//Review.disableRemoteMethod('__get__tags', false);
//Review.disableRemoteMethod('__create__reviews', false);
Review.disableRemoteMethod('__delete__product', false);
Review.disableRemoteMethod('__create__product', false);
};
