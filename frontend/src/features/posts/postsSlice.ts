import type { Post } from '../../interfaces.ts';
import { createSlice } from '@reduxjs/toolkit';
import { createPost, getPosts } from './postsThunks.ts';

interface State {
  items: Post[];
  fetchLoading: boolean;
  createLoading: boolean;
}

const initialState: State = {
  items: [],
  fetchLoading: false,
  createLoading: false,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.fetchLoading = true;
      })
      .addCase(getPosts.fulfilled, (state, { payload: posts }) => {
        state.fetchLoading = false;
        state.items = posts;
      })
      .addCase(getPosts.rejected, (state) => {
        state.fetchLoading = false;
      });

    builder
      .addCase(createPost.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createPost.rejected, (state) => {
        state.createLoading = false;
      });
  },
  selectors: {
    posts: (state) => state.items,
    fetchLoading: (state) => state.fetchLoading,
    createLoading: (state) => state.createLoading,
  },
});

export const postsReducer = postsSlice.reducer;
export const { posts, fetchLoading, createLoading } = postsSlice.selectors;
