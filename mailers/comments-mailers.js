const nodeMailer = require('../config/nodemailer');

module.exports.newComment = function(comment) {
    console.log(comment);
    nodeMailer.sendMail({
        from: 'mehapatel601@gmail.com',
        to: comment.user.email,
        subject: "New Comment",
        html: "Someone has commented on your post."
    }, function(err, info) {
        if (err) {
            console.log("Error in sending the mail", err);
            return;
        }
        console.log("Message sent", info);
        return;
    });
}