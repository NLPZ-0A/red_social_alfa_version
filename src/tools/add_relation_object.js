const PostInstance = require('../models/post');
const Post = new PostInstance();

module.exports.addLikeProperty =  (posts_, user_id) => {

    let posts = posts_;

    return (async function() {


        for (let post of posts) {
            let likePost = await Post.getLikeforPost(post.id);  
            let iLikePost_ = await Post.isLikePost(user_id, post.id);
            
            post.likesCount = likePost.length;
            post.iLikePost = iLikePost_.length > 0 ;
        }
      
        return await posts;
    })();

    
};
