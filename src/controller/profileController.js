const User = require('../models/User');
const Profile = require('../models/Profile');
const Post = require('../models/post');
const Conversation = require('../models/Conversations');
const parseSQL = require('../tools/parseSQL');
const { parseDate } = require('../tools/get_date_now');

const postInstance = new Post();
const userInstance = new User();
const profileInstance = new Profile();
const conversationInstance = new Conversation();

const addProfile = async (req, res) => {
    const user_id = req.usuario.id;

    console.log('llamada');
    console.log(req.body);
    const { phone, job, positionJob, location, birthday, description} = req.body;

    const data = {
        
        user_id : user_id,
        phone : phone.trim(),
        job : job.trim(),
        positionJob : positionJob.trim(), 
        location : location.trim(),
        birthday : birthday.trim(), 
        description : description.trim()
    };

    const profile = new Profile(data);

    const profileRequest = await profile.getProfileById(user_id);

    if (!profileRequest.length){
        const saveProfile = await profile.saveProfile();
        return res.status(200).json({message: 'terminado!'});
    }

    const updateProfile = profile.updateProfile();
    return res.status(200).json({ message : 'terminado!' });
};

const profile = async (req, res) => {

    try{
    
        const currentUser = req.usuario;
        const username = req.params.username;

        const userObject = await userInstance.getUserbyUsername(username);
        const user = userObject[0];


        if(!user){
            const userObject = await userInstance.getPredictByUsername(username);
            const users = userObject;
            console.log(users);
            return res.render('user-not-found', {title: 'user not found',currentUser : currentUser, users:users, layout: false})
        }

        const postsReq = await postInstance.getPostByUserId(user.id);
        const postsObject= parseSQL(postsReq);
        const profileInstance = new Profile({});
      
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

        const profileDataReq = await profileInstance.getProfileById(currentUser.id)
        const profileData = profileDataReq[0]
        
    return res.render('profile', {title:'profile', user:user, posts:posts, currentUser:currentUser, followData:followData, profileData:profileData, layout:false});

    }catch(err){
        console.log(err);
        res.status(404).send({message:'Ocurrio un error al procesarse la petición.'});
    }
};

const uploadProfilePhoto = async (req, res) => {
    const currentUser = req.usuario;
    const file = req.file;

    console.log('imagen recibida');

    let imageName = '';

    if(file){
          imageName = file.filename;
    }

    const uploadProfile = await profileInstance.uploadPhoto(imageName, currentUser.id);
    res.status(200).json({message : 'imagen cargada correctamente'});
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

           let conversation;


           conversation = await conversationInstance.getConversationBetweenUsers(currentUser.id, toUser.id);

           if(!conversation.length){
             console.log('creando conversacion!');
             const newConversations = new Conversation(currentUser.id, toUser.id);
             const saveConversation = await newConversations.saveConversation();
             conversation = await conversationInstance.getConversationBetweenUsers(currentUser.id, toUser.id);
           }

           //let conversation_id = conversation[0].id;

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

module.exports = {profile, follow, unfollow, addProfile, uploadProfilePhoto};

