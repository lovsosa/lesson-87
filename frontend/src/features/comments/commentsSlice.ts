import { createSlice } from '@reduxjs/toolkit';
import type { Comment } from '../../interfaces.ts';
import { createComment, fetchComments } from './commentsThunks.ts';

interface State {
  items: Comment[];
  fetchLoading: boolean;
  createLoading: boolean;
}

const initialState: State = {
  items: [],
  fetchLoading: false,
  createLoading: false,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.fetchLoading = true;
        state.items = [];
      })
      .addCase(fetchComments.fulfilled, (state, { payload }) => {
        state.fetchLoading = false;
        state.items = payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.fetchLoading = false;
      });

    builder
      .addCase(createComment.pending, (state) => {
        state.createLoading = true;
      })
      .addCase(createComment.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createComment.rejected, (state) => {
        state.createLoading = false;
      });
  },
  selectors: {
    comments: (state) => state.items,
    commentsLoading: (state) => state.fetchLoading,
    commentCreateLoading: (state) => state.createLoading,
  },
});

export const commentsReducer = commentsSlice.reducer;
export const { comments, commentsLoading, commentCreateLoading } =
  commentsSlice.selectors;
