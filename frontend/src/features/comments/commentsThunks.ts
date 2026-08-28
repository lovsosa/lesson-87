import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Comment, CommentMutation } from '../../interfaces.ts';
import type { RootState } from '../../app/store.ts';
import axiosApi from '../../axiosApi.ts';

export const fetchComments = createAsyncThunk<Comment[], string>(
  'comments/fetch',
  async (postId) => {
    const { data } = await axiosApi.get<Comment[]>('/comments', {
      params: { post: postId },
    });
    return data;
  },
);

export const createComment = createAsyncThunk<
  void,
  CommentMutation,
  { state: RootState }
>('comments/create', async (comment, { getState }) => {
  const token = getState().users.user?.token;

  await axiosApi.post('/comments', comment, {
    headers: { Authorization: token },
  });
});
