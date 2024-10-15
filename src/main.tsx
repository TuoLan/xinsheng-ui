// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './index.scss'
import store, { persistor } from './store/store.ts';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    {/* <StrictMode> */}
    <ConfigProvider locale={zhCN}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </ConfigProvider>
    {/* </StrictMode> */}
  </Provider>
)
