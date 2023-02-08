const Post = require('../models/post');
const Like = require('../models/Like');

const postsInstance = new Post();

const createPost = async (req, res) => {

        console.log('creando post');
        try{
            console.log(req.body);
            const filename = req.file || '';
            const {content} = req.body;
            const title = '';
            const { id } = req.usuario;
            const file = req.file;
            let imageName = '';


            if(file){
              imageName = file.filename;
            }
            
            const contentValid = content.trim();
            const image = imageName.trim();

            const newPost = new Post(title ,contentValid, image, id);

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
     
}

const editPost = async (req, res) => {
    console.log('editar post');

    try{
        console.log(req.body);
        const { idPost , content} = req.body;
        const title = '';
        const file = req.file;
        let imageName = '';

        if(file){
          imageName = file.filename;
        }

        const image = imageName.trim();
        const contentValid = content.trim();
        const titleValid = title.trim();



        const editPost = new Post(titleValid ,contentValid, image);


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
}

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

}

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

        const addLike = await newLike.deleteLike(user.id, post_id);

         res.status(200).json({success : true});

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Ha ocurrido un error'});
    }

}

module.exports = {createPost, 
                    addLike, 
                    removeLike,
                    editPost,
                    deletePost};