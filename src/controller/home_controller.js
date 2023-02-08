const db = require('../database/db_local');
const parseSQL = require('../tools/parse_sql')
const { parsearFecha } = require('../tools/get_date_now');
const addRelationObject = require('../tools/add_relation_object');
const Post_controller = require('../controller/post_controller');

const post_controller = new Post_controller();


module.exports.home =  async (req, res)=>{

    const posts_ = await post_controller.getFriendsPostFeed(req.usuario.id);
    const currentUser = req.usuario;
    let posts_users = await addRelationObject.addLikeProperty(posts_ ,currentUser.id);
    const posts = parsearFecha(posts_users);


    res.render('home', {title:'blog', user : req.usuario, currentUser:currentUser , posts: posts });
}