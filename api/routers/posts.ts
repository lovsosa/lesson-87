import express from 'express';
import mongoose from 'mongoose';
import { imagesUpload } from '../multer';
import Post from '../models/Post';
import Comment from '../models/Comment';
import auth, { RequestWithUser } from '../middlewares/auth';

const postsRouter = express.Router();

postsRouter.get('/', async (_req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .lean();

    const counts = await Comment.aggregate<{
      _id: mongoose.Types.ObjectId;
      count: number;
    }>([{ $group: { _id: '$post', count: { $sum: 1 } } }]);

    const countByPost = new Map(
      counts.map((c) => [c._id.toString(), c.count]),
    );

    const result = posts.map((post) => ({
      ...post,
      commentsCount: countByPost.get(post._id.toString()) ?? 0,
    }));

    res.send(result);
  } catch {
    res.sendStatus(500);
  }
});

postsRouter.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username');

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    res.send(post);
  } catch {
    res.sendStatus(500);
  }
});

postsRouter.post('/', auth, imagesUpload.single('image'), async (req, res) => {
  const user = (req as RequestWithUser).user;
  const { title, description } = req.body;

  if (!title || (!description && !req.file)) {
    return res
      .status(400)
      .send({ error: 'Title, and description or image are required!' });
  }

  try {
    const post = new Post({
      user: user._id,
      title,
      description: description || null,
      image: req.file ? req.file.filename : null,
    });

    await post.save();
    res.send(post);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }
    res.sendStatus(500);
  }
});

postsRouter.delete('/:id', auth, async (req, res) => {
  try {
    const user = (req as RequestWithUser).user;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    if (String(post.user) !== String(user._id)) {
      return res.status(403).send({ error: 'You can delete only your own post' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.send({ message: 'Post deleted' });
  } catch {
    res.sendStatus(500);
  }
});

export default postsRouter;
