const moment = require('moment');
moment.locale('es');


const getFullDate = () => {
    const date = moment();
    const dateNow = date.local()
 
    return dateNow.format("YYYY-MM-DD HH:mm:ss");
}

function parseDate(posts){


    posts.forEach(post => {
        post.date = moment(post.created_at).local().fromNow();
        console.log(post.date);
    });
    return posts;
}


module.exports = {parseDate,
                getFullDate}