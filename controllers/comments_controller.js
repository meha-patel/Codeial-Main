const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments-mailers.js');

module.exports.create = async function(req, res) {
    let post = await Post.findById(req.body.post);
    if (post) {
        let comment = await Comment.create({
            content: req.body.content,
            post: req.body.post,
            user: req.user._id
        });

        post.comments.push(comment);
        post.save();
        let populatedComment = await comment.populate('user', 'name email').execPopulate();
        console.log(populatedComment);
        commentsMailer.newComment(populatedComment);
        res.redirect('/');
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    comment: comment,
                },
                message: "Post created",
            });
        }
        req.flash('success', 'Comment published');
        res.redirect('/');
    }
}

module.exports.destroy = function(req, res) {
    Comment.findById(req.params.id, function(err, comment) {
        if (comment.user == req.user.id) {
            let postId = comment.post;

            comment.remove();

            Post.findOneAndUpdate(postId, { $pull: { comments: req.params.id } }, function(err, post) {
                return res.redirect('back');
            })
        } else {
            return res.redirect('back');
        }
    })
}