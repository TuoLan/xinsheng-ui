import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 使用 localStorage
import userReducer from './reducers/userReducer'; // 引入你的 userReducer

// 配置持久化设置
const persistConfig = {
  key: 'root',
  storage,
};

// 将 reducer 包裹在 persistReducer 中
const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    //关闭redux序列化检测
    serializableCheck: false
  })
});

export const persistor = persistStore(store); // 创建 persistor

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
