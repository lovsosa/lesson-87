import express from 'express';
import mongoose from 'mongoose';
import Comment from '../models/Comment';
import Post from '../models/Post';
import auth, { RequestWithUser } from '../middlewares/auth';

const commentsRouter = express.Router();

commentsRouter.get('/', async (req, res) => {
  try {
    const filter: { post?: string } = {};

    if (req.query.post) {
      filter.post = req.query.post as string;
    }

    const comments = await Comment.find(filter)
      .sort({ createdAt: 1 })
      .populate('user', 'username');

    res.send(comments);
  } catch {
    res.sendStatus(500);
  }
});

commentsRouter.post('/', auth, async (req, res) => {
  const user = (req as RequestWithUser).user;

  try {
    const comment = new Comment({
      user: user._id,
      post: req.body.post,
      text: req.body.text,
    });

    await comment.save();
    await comment.populate('user', 'username');

    res.send(comment);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    res.sendStatus(500);
  }
});

commentsRouter.delete('/:id', auth, async (req, res) => {
  try {
    const user = (req as RequestWithUser).user;
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).send({ error: 'Comment not found' });
    }

    const post = await Post.findById(comment.post);
    const isCommentAuthor = String(comment.user) === String(user._id);
    const isPostAuthor = post ? String(post.user) === String(user._id) : false;

    if (!isCommentAuthor && !isPostAuthor) {
      return res
        .status(403)
        .send({ error: 'You can delete only your own comment or a comment on your post' });
    }

    await comment.deleteOne();
    res.send({ message: 'Comment deleted' });
  } catch {
    res.sendStatus(500);
  }
});

export default commentsRouter;
