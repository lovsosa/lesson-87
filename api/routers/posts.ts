import { PostWithoutId } from './../types';
import express from 'express';
import { imagesUpload } from '../multer';
import Post from '../models/Post';

const postsRouter = express.Router();

postsRouter.get('/', async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.send(posts);
  } catch {
    res.sendStatus(500);
  }
});

postsRouter.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }

    res.send(post);
  } catch {
    res.sendStatus(500);
  }
});

postsRouter.post('/', imagesUpload.single('image'), async (req, res) => {
  const { title, description } = req.body;

  if (!title || (!description && !req.file)) {
    return res
      .status(400)
      .send({ error: 'Title, description or image are required!' });
  }

  const newPost: PostWithoutId = {
    user: null,
    title,
    description,
    image: req.file ? req.file.filename : null,
  };

  try {
    const post = new Post(newPost);
    await post.save();
    res.send(post);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(400).send({ message: e.message });
    }
    res.sendStatus(500);
  }
});
export default postsRouter;
