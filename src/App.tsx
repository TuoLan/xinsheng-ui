import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./view/home/index.tsx";
import Login from "./view/login/index.tsx";
import Register from "./view/register/index.tsx";
import './App.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home/*" element={<Home />} /> {/* 这里使用通配符 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;