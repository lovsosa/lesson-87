import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Post, PostMutation } from '../../interfaces.ts';
import axiosApi from '../../axiosApi.ts';

export const getPosts = createAsyncThunk<Post[]>('posts/getAll', async () => {
  const { data: posts } = await axiosApi('/posts');
  return posts;
});

export const createPost = createAsyncThunk<void, PostMutation>(
  'posts/create',
  async (post) => {
    const formData = new FormData();

    const keys = Object.keys(post) as (keyof PostMutation)[];
    keys.forEach((key) => {
      const value = post[key];

      if (value) {
        formData.append(key, value);
      }
    });

    await axiosApi.post('/posts', formData);
  },
);
