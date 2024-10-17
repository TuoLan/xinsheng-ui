import { useEffect } from "react";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./view/home/index.tsx";
import Login from "./view/login/index.tsx";
import Register from "./view/register/index.tsx";
import './App.scss';

function App() {
  useEffect(() => {
    const userAgent = window.navigator.userAgent; // 获取用户代理字符串
    const isHeader = !userAgent.includes('MicroMessenger'); // 检查是否为微信浏览器
    window.localStorage.setItem('isHeader', isHeader + '')
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/index" replace />} />
        <Route path="/index/*" element={<Home />} /> {/* 这里使用通配符 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;