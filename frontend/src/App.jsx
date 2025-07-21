import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "tailwindcss"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Registration';
import Navbar from './components/Navbar';
import Home from './pages/home'
import Login from './pages/login'
import Newproblem from './pages/newproblem'

function App() {
  const [count, setCount] = useState(0)

  return (
       <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newproblem" element={<Newproblem/>}/>
      </Routes>
    </Router>
  );
}

export default App
