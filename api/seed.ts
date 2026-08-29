import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import config from './config';
import User from './models/User';
import Post from './models/Post';
import Comment from './models/Comment';

const run = async () => {
  await mongoose.connect(config.mongoDbUrl);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('posts');
    await db.dropCollection('comments');
  } catch {
    console.log('Collections were not present, skipping drop');
  }

  const [Admin, Melis, Heisenberg] = await User.create([
    { username: 'Admin', password: '123', token: randomUUID() },
    { username: 'Melis', password: '123', token: randomUUID() },
    { username: 'Heisenberg', password: '123', token: randomUUID() },
  ]);

  const [post1, post2, post3] = await Post.create([
    {
      user: Admin._id,
      title: 'Народ! что посоветуюте посмотреть на эти выходные?',
      description: 'Что то типа вестерна',
      image: null,
    },
    {
      user: Melis._id,
      title: 'Кто придет на всемирные игры кочевников?',
      description: 'Уже купили билеты на мероприятие?',
      image: null,
    },
    {
      user: Heisenberg._id,
      title: 'Гаргантюа',
      description:
        'Гаргантюа это вымышленная сверхмассивная чёрная дыра из научно-фантастического фильма Кристофера Нолана «Интерстеллар», масса которой равна 100 миллионам масс Солнца',
      image: 'gargantua-black.jpg',
    },
  ]);

  await Comment.create([
    {
      user: Heisenberg._id,
      post: post1._id,
      text: 'Say my name',
    },
    {
      user: Admin._id,
      post: post2._id,
      text: 'Очень хотел бы посетить мероприятия но билеты 5000 сом!',
    },
    {
      user: Heisenberg._id,
      post: post2._id,
      text: 'Не, мне лень выбираться из дома',
    },
    {
      user: Melis._id,
      post: post3._id,
      text: 'Интерстеллар мой любимый фильм!',
    },
  ]);

  console.log(
    'Seed done: %d users, %d posts, %d comments',
    await User.countDocuments(),
    await Post.countDocuments(),
    await Comment.countDocuments(),
  );

  await db.close();
};

run().catch(console.error);
