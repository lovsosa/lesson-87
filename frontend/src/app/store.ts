import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  REGISTER,
  PERSIST,
  PURGE,
  persistStore,
  persistReducer,
} from 'redux-persist';
import storageModule from 'redux-persist/lib/storage';
import { usersReducer } from '../features/users/usersSlice';
import { postsReducer } from '../features/posts/postsSlice';
import { commentsReducer } from '../features/comments/commentsSlice';

const storage =
  (storageModule as unknown as { default?: typeof storageModule }).default ??
  storageModule;

const usersPersistConfig = {
  key: 'forum:users',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  posts: postsReducer,
  comments: commentsReducer,
  users: persistReducer(usersPersistConfig, usersReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    });
  },
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
