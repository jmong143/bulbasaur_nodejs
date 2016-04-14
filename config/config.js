var nodemailer = require('nodemailer');

transporter : nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'seostardibs@gmail.com',
      pass: 'dibs0102'
  }
});
/*var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
				user: 'seostardibs@gmail.com',
				pass: 'dibs0102'
		}
});
*/
/*
//var emailSendingProcess = {
    emailSendingProcess : function(email, objectId){

      console.log("new object ID-> " + objectId);
      var emailTemplate = '<div style="text-decoration: underline;"><a href = "http://localhost:2000/ipostmo-auth/mail-signup/'+ objectId +'">click to verify your account101</a></div>';
      //var emailTemplate = '<div style="text-decoration: underline;"><a href = "http://54.169.169.163:2000/ipostmo-auth/mail-signup/'+ objectId +'">click to verify your account101</a></div>';
      var mailOptions = {
        from: '"Ipostmo.com" <ipostmo@gmail.com>', // sender address
        to: 'email,' + email, // list of receivers
        subject: 'Welcome to Ipostmo.com!', // Subject line
        text: 'Ipostmo.com Verification', // plaintext body
        html: emailTemplate // html body
      };
      transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
      }
      console.log('Message sent: ' + info.response);
      });
    }
 //};

*/
//FORMAT TEXT FOR EMAIL SENDING
/*
var send = function(email, objectId){
  console.log("new object ID-> " + objectId);
  var emailTemplate = '<div style="text-decoration: underline;"><a href = "http://localhost:2000/ipostmo-auth/mail-signup/'+ objectId +'">click to verify your account101</a></div>';
  //var emailTemplate = '<div style="text-decoration: underline;"><a href = "http://54.169.169.163:2000/ipostmo-auth/mail-signup/'+ objectId +'">click to verify your account101</a></div>';
  var mailOptions = {
    from: '"Ipostmo.com" <ipostmo@gmail.com>', // sender address
    to: 'email,' + email, // list of receivers
    subject: 'Welcome to Ipostmo.com!', // Subject line
    text: 'Ipostmo.com Verification', // plaintext body
    html: emailTemplate // html body
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
  }
  console.log('Message sent: ' + info.response);
  });
}
*/
