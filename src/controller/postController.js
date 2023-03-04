const Post = require('../models/post');
const Like = require('../models/Like');
const Comments = require('../models/Comments');

const postsInstance = new Post();
const commentInstance = new Comments();

const createPost = async (req, res) => {

        console.log('creando post');
        try{
            console.log(req.body);
            const {content} = req.body;
            const title = '';
            const { id } = req.usuario;
            const fileReq = req.file || '';
            let fileName = '';
       
            console.log(fileReq.filename);
            if(fileReq.filename){
                fileName = fileReq.filename;
            }

            const file = fileName.trim();
            const contentValid = content.trim();
           

            const newPost = new Post(title ,contentValid, file, id);

            if(!content && !file){
                return res.status(403);
              }

            await newPost.savePost();
            res.status(200);
        }catch(err){
            console.log(err);
            return res.status(400).send({proceso: 'campos invalidos'});
        }

        res.redirect('/home');
     
};

const replyPost= async(req, res) =>{
    console.log('compartiendo post');
        try{
            const post_id = req.params.post_id;
            const user_id = req.usuario.id;
            const { content } = req.body;
            
            console.log(content);
            
            let postReply = await postsInstance.getPostById(post_id)

            if(!(postReply.length)){
                return res.status(403).json('el post no existe');
            }
            let postTarget = postReply[0];

            let to_user_id = postTarget.user_id;
            let to_id_post = post_id;
            let originalContent = content;
            let dateReply = postTarget.created_at;

            const newPost = new Post(postTarget.title ,postTarget.content, postTarget.file, user_id, to_user_id, to_id_post, originalContent, dateReply);

            await newPost.replyPost();
            return res.status(200).json({message :'efectivo!'});
        }catch(err){
            console.log(err);
            return res.status(400).send({proceso: 'campos invalidos'});
        }

        res.redirect('/home');
};

const editPost = async (req, res) => {
    console.log('editar post');

    try{
        console.log(req.body);
        const { idPost , content} = req.body;
        const title = '';
        const fileReq = req.file || '';
        let fileName = '';
       
        console.log(fileReq.filename);
        if(fileReq.filename){
            fileName = fileReq.filename;
        }

        const file = fileName.trim();
        const contentValid = content.trim();
        const titleValid = title.trim();

        const editPost = new Post(titleValid ,contentValid, file);


        if(!content && !file){
            return res.status(403);
          }

        await editPost.updatePost(idPost);
        res.status(200)

    }catch(err){
        console.log(err);
        return res.status(400).send({proceso: 'campos invalidos'});
    }

    res.redirect('/home');
};

const deletePost = async (req, res) => {
    const id = req.params.id.trim();
    const post = await postsInstance.getPostById(id);
    
    console.log(post);

    if(!(post.length)){
        return res.status(403).json({message: 'no existe este post'});
    }

    await postsInstance.deletePost(id);
    return res.status(200).json({succes: 'Post eliminado'});
};

const addLike = async(req, res)=>{

    try{
        console.log('likeado');
        const user = await req.usuario;
        const post_id = await req.params.post_id.trim();
        const newLike = new Like(user.id, post_id);

        
        const existingLike = await newLike.findOne(user.id, post_id);
      
        if(existingLike.length){
            console.log('ya se ha dado like a esta publicacion');
            return res.status(400);
        }

        const addLike = await newLike.addLike();

        res.status(200).json({success : true});

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Ha ocurrido un error'});
    }

};

const removeLike = async(req, res)=>{

    try{
        console.log('like removed');
        const user = await req.usuario;
        const post_id = await req.params.post_id.trim();
        const newLike = new Like(user.id, post_id);

        const existingLike = await newLike.findOne(user.id, post_id);
      
        if(!existingLike){
            console.log('No has dado like a esta publicacion');
            return res.status(400);
        }

        const removeLike = await newLike.deleteLike(user.id, post_id);

         res.status(200).json({success : true});

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Ha ocurrido un error'});
    }

};

const addLikeComments = async(req, res) =>{
    try{
        const user = req.usuario;
        const comment_id = req.params.id;

        const existingLike = await commentInstance.findOne(user.id, comment_id);

        if(!existingLike.length){
            console.log('ya se ha dado like a esta publicacion');
            return res.status(400);
        }

        const addlike = await commentInstance.addLike(user.id, comment_id);

        return res.status(200).json({success : true});

    }catch(err){
        console.log(err);
        return res.status(500).json({message : 'Ha ocurrido un error'});
    }
};

const removeLikeComments = async(req, res) =>{
    try{
        const user = req.usuario;
        const comment_id = req.params.id;

        const existingLike = await commentInstance.findOne(user.id, comment_id);

        if(!existingLike.length){
            console.log('No has dado like a esta publicacion');
            return res.status(400);
        }

        const removelike = await commentInstance.deleteLike(user.id, comment_id);

        return res.status(200).json({success : true});

    }catch(err){
        console.log(err);
        return res.status(500).json({message : 'Ha ocurrido un error'});
    }
};

module.exports = {createPost, addLike, removeLike,
                   editPost, deletePost, removeLikeComments,
                   addLikeComments, replyPost};