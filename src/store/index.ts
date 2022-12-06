import { COMMON_STORE } from './../config/storageKeys';
import { configureStore } from '@reduxjs/toolkit';
import home from './reducers/home';
import { throttle } from 'lodash';

const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem(COMMON_STORE);
    if (serializedState) {
      return JSON.parse(serializedState);
    }
    return undefined;
  } catch (_) {
    return undefined;
  }
};

const saveState = (state: object) => sessionStorage.setItem(COMMON_STORE, JSON.stringify(state));

// configureStore创建一个redux数据
const store = configureStore({
  // 合并多个Slice
  reducer: {
    home,
  },
  preloadedState: loadState(),
});

// 监听store
store.subscribe(throttle(() => saveState(store.getState()), 500));

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
