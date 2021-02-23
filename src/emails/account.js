const sgMail = require("@sendgrid/mail");

const sgMailAPIKey = "jf;adfsaaaaaaaaaaaaaaa";
sgMail.setApiKey(sgMailAPIKey);

const sendWelcomeEmail = (name, email) => {
  sgMail.send({
    to: email,
    from: "ali@kuwar.tk",
    subject: "Welcome",
    text: "Welcome to our app  " + name,
  });
};

const sendCancelEmail = function (name, email) {
  sgMail.send({
    from: "ali@kuwar.tk",
    from: email,
    subject: "GoodBye, we will miss you",
    text: `GoodBye ${name} , we will miss you maybe you can tell y you are leaving by replying to this mail`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
