import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User';

const usersRouter = express.Router();

usersRouter.post('/', async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(e);
    }

    res.sendStatus(500);
  }
});

usersRouter.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(400).send({ error: 'Имя пользователя или пароль неверны' });
  }

  const isMatch = await user.checkPassword(req.body.password);

  if (!isMatch) {
    return res.status(400).send({ error: 'Имя пользователя или пароль неверны' });
  }

  user.generateToken();
  await user.save();

  res.send(user);
});

usersRouter.delete('/logout', async (req, res) => {
  try {
    const token = req.get('Authorization');

    if (!token) {
      return res.status(204).send();
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(204).send();
    }

    user.generateToken();
    await user.save();

    res.status(204).send();
  } catch {
    res.sendStatus(500);
  }
});

export default usersRouter;
