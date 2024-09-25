import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/index.tsx"
import Login from "./view/login/index.tsx"
import Register from "./view/register/index.tsx"
import './App.scss'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Layout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
