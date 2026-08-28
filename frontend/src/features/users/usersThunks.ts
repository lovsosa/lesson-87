import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi.ts";
import type {GlobalError, LoginMutation, RegisterMutation, User, ValidationError} from "../../interfaces.ts";
import {isAxiosError} from "axios";
import type {AppDispatch, RootState} from "../../app/store.ts";
import {unsetUser} from "./usersSlice.ts";

export const register = createAsyncThunk<User, RegisterMutation, { rejectValue: ValidationError }>(
  'users/register',
  async (registerMutation, { rejectWithValue }) => {
    try {
      const { data: user } = await axiosApi.post('/users', registerMutation);
      return user;
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  }
);

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation, { rejectWithValue }) => {
    try {
      const { data: user } = await axiosApi.post('/users/login', loginMutation);
      return user;
    } catch (error) {
      if (isAxiosError(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data);
      }

      throw error;
    }
  }
);

export const logout = createAsyncThunk<void, undefined, { state: RootState, dispatch: AppDispatch }>(
  'users/logout',
  async (_, { getState, dispatch }) => {
    const token = getState().users.user?.token;
    try {
      await axiosApi.delete('/users/logout', { headers: {'Authorization': token} });
    } finally {
      dispatch(unsetUser());
    }
  }
);