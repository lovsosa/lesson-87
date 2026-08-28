import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Post, PostMutation } from '../../interfaces.ts';
import type { RootState } from '../../app/store.ts';
import axiosApi from '../../axiosApi.ts';

export const getPosts = createAsyncThunk<Post[]>('posts/getAll', async () => {
  const { data: posts } = await axiosApi('/posts');
  return posts;
});

export const fetchOnePost = createAsyncThunk<Post, string>(
  'posts/fetchOne',
  async (id) => {
    const { data } = await axiosApi.get<Post>(`/posts/${id}`);
    return data;
  },
);

export const createPost = createAsyncThunk<void, PostMutation, { state: RootState }>(
  'posts/create',
  async (post, { getState }) => {
    const token = getState().users.user?.token;

    const formData = new FormData();

    const keys = Object.keys(post) as (keyof PostMutation)[];
    keys.forEach((key) => {
      const value = post[key];

      if (value) {
        formData.append(key, value);
      }
    });

    await axiosApi.post('/posts', formData, {
      headers: { Authorization: token },
    });
  },
);
