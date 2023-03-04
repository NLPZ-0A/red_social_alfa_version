//--------------------------------------MODELOS-----------------------------------------------------------------------------
const Comment = require('../models/Comments');

const addComment = async(req ,res) =>{
    
    try{
        const user_id = req.usuario.id;
        const post_id = req.params.id;
        const { content } = req.body;

        console.log(req.body);
        console.log(`cantidad de caracteres ${content.trim().length}`);

        if(!content.trim().length){
            return res.status(403).json({message:'comentario vacio!'});
        }

        
        const comment = new Comment(user_id, post_id, content);

        const saveComment = await comment.saveComment();

        res.status(200).json({message : 'se ha guardado el comentario correctamente'});
    }catch(err){
        console.log(err);
        res.status(403).json({message : 'hubo un error al guardad el commentario'});
    }
};

const deleteComment = async(req ,res) =>{
    
    try{
        const comment_id = req.params.id;
        const commentInstance = new Comment();
        const existComment = await commentInstance.getCommentById(comment_id);

        if(!existComment){
            return res.status(403).json({message : 'no existe el usuario!'});
        }

        const deleteComment = await commentInstance.deleteComment(comment_id);

        return res.status(200).json({message : 'se ha guardado el comentario correctamente'});
    }catch(err){
        console.log(err);
        res.status(403).json({message : 'hubo un error al guardad el commentario'});
    }
};

module.exports = {addComment, deleteComment};