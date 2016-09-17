//var g = require('strong-globalize')();

module.exports = function(Contact) {
  // send an email
  Contact.sendEmail = function(request, cb) {
    Contact.app.models.Email.send({
      to: 'ourpartynest@gmail.com',
      from: 'partynestserver@gmail.com',
      subject: 'New Contact Request from ' + request.firstName + ' ' + request.lastName,
      text: request.feedback,
      html: '<em>Contact Request:</em><br>' + 
        'Tel no: ' + request.telno + '<br>Name: ' + 
        request.firstName + ' ' + request.lastName + '<br>Feedback text: ' + request.feedback
    }, function(err, mail) {
      cb(err,"Email sent");
    });
    
  }
  
   Contact.afterRemote('create', function(context, contactInstance, next) {
        console.log('Contact.afterRemote triggered');

        Contact.sendEmail(contactInstance, function (res, text){
            console.log('Contact sent email ',text);            
        });
       next();
/*    var options = {
      type: 'email',
      to: contactInstance.email,
      from: 'autopagegezina@gmail.com',
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      user: user
    };
 
    userInstance.verify(options, function(err, response, next) {
      if (err) return next(err);
 
      console.log('> verification email sent:', response);
 
      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' +
            'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in'
      });
    }); */
  });
};
