import type { Post } from '../../interfaces.ts';
import { createSlice } from '@reduxjs/toolkit';
import { createPost, fetchOnePost, getPosts } from './postsThunks.ts';

interface State {
  items: Post[];
  onePost: Post | null;
  fetchLoading: boolean;
  fetchOneLoading: boolean;
  createLoading: boolean;
}

const initialState: State = {
  items: [],
  onePost: null,
  fetchLoading: false,
  fetchOneLoading: false,
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
      .addCase(fetchOnePost.pending, (state) => {
        state.fetchOneLoading = true;
        state.onePost = null;
      })
      .addCase(fetchOnePost.fulfilled, (state, { payload: post }) => {
        state.fetchOneLoading = false;
        state.onePost = post;
      })
      .addCase(fetchOnePost.rejected, (state) => {
        state.fetchOneLoading = false;
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
    onePost: (state) => state.onePost,
    fetchLoading: (state) => state.fetchLoading,
    onePostLoading: (state) => state.fetchOneLoading,
    createLoading: (state) => state.createLoading,
  },
});

export const postsReducer = postsSlice.reducer;
export const { posts, onePost, fetchLoading, onePostLoading, createLoading } =
  postsSlice.selectors;
