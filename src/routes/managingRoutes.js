
const authRouter = require('./authRouter.js');
const postsRouter = require('./postsRouter.js');
const userRouter = require('./userRouter.js');
const profileRouter = require('./profileRouter');
const configRouter = require('./configRouter');
const commentsRouter = require('./commentRouter');
const chatRouter = require('./chatRoutes');
const notifyRouter = require('./notificationsRouter');

module.exports = (app) => {
app.use('/', userRouter);
app.use('/auth', authRouter);
app.use('/post', postsRouter);
app.use('/profile', profileRouter);
app.use('/config', configRouter);
app.use('/comments', commentsRouter);
app.use('/chat', chatRouter);
app.use('/notifications', notifyRouter);

}