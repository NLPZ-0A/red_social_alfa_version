const User = require('../models/User');
const Profile = require('../models/Profile');
const Post = require('../models/post');
const parseSQL = require('../tools/parseSQL');
const { parseDate } = require('../tools/get_date_now');

const postInstance = new Post();
const userInstance = new User();

const addProfile = async (req, res) => {
    const user_id = req.usuario.id;
    
    const {phone, job, positionJob, location, birthday, description} = req.body;
    const data = {
        user_id : user_id.trim(),
        phone : phone.trim(),
        job : job.trim(),
        positionJob : positionJob.trim(), 
        location : location.trim(),
        birthday : birthday.trim(), 
        description : description.trim()
    };
    const profile = new Profile(data);
    await profile.saveProfile();
};

const profile = async (req, res) => {
    
        const currentUser = req.usuario;
        const username = req.params.username;
        const userObject = await userInstance.getUserbyUsername(username);
        const user = userObject[0];
        const postsReq = await postInstance.getPostByUserId(user.id);
        const postsObject= parseSQL(postsReq);
        console.log(postsObject);
        let follow = false;


        const postsWithLikes = await Promise.all(postsObject.map(async post => {
            //const likes = await postsFilter.getLikes(currentUser.id);
            const likes = await postInstance.getLikeforPost(post.id);  
            const likesReq = await postInstance.getLikes(post.id);
            const likesCount = likesReq[0].likes;
            const iLikePost = likes.some(like => like.user_id === currentUser.id);
            return { ...post, iLikePost, likesCount};
        }));
        const posts = parseDate(postsWithLikes);

        const rel = await userInstance.getRelationsUsers(currentUser.id, user.id);
        const relationsFollowers = await userInstance.allRelationsFollowers(user.id);
        const relationsFollowed = await userInstance.allRelationsFollowed(user.id);
        
        
        if(rel.length){
            follow = true;
        }else{
            follow = false;
        }
        
        let followData = {
            follow: follow,
            followers : relationsFollowers.length,
            followed : relationsFollowed.length
        }
        
    return res.render('profile', {title:'profile', user : user, posts : posts, currentUser:currentUser, followData : followData});
};

const follow =  async (req, res) => {

    try{
        const currentUser = req.usuario;
        const username = req.params.username;
    
        const toUserObject = await userInstance.getUserbyUsername(username);
        const toUser = toUserObject[0];
        const rel = await userInstance.getRelationsUsers(currentUser.id, toUser.id);
    
        if (rel.length){
           return res.redirect(`/profile/${username}`);
        }else{

           await userInstance.addFollower(currentUser.id, toUser.id)
           return res.redirect(`/profile/${username}`);
        }
    }catch(err){
        throw err;
    }
};
    
const unfollow =  async (req, res) => {

    try{
        const currentUser = req.usuario;
        const username = req.params.username;

        const toUserObject = await userInstance.getUserbyUsername(username);
        const toUser = toUserObject[0];
        const rel = await userInstance.getRelationsUsers(currentUser.id, toUser.id);
        
            if (!rel.length){
            return res.redirect(`/profile/${username}`);
            }else{
            await userInstance.removeFollower(currentUser.id, toUser.id)
            return res.redirect(`/profile/${username}`);
            }
    
    }catch(err){
        throw err;
    }
    
};

module.exports = {profile, follow, unfollow, addProfile};

