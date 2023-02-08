const db=require('../database/db_local');
const Post_controller = require('../controller/post_controller');

const post_controller = new Post_controller(db);

module.exports.addLikeProperty =  (posts_, user_id) => {

    let posts = posts_;

    return (async function() {


        for (let post of posts) {
            let likePost = await post_controller.getLikeforPost(post.id);  
            let iLikePost_ = await post_controller.isLikePost(user_id, post.id);
            
            post.likesCount = likePost.length;
            post.iLikePost = iLikePost_.length > 0 ;
        }
      
        return await posts;
    })();

    
};
