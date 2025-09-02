import { useState } from 'react'
import { useSelector } from 'react-redux';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/auth/Registration';
import Home from './pages/home'
import Login from './pages/auth/login'
import Newproblem from './pages/problems/createproblem'
import ProblemList from './pages/problems/problemlist'
import { ProtectedRoute, AdminRoute } from './features/protectedRoute';
import Discription from './pages/problems/Discription';
import Updateproblem from './pages/problems/updateproblem';
import Contest from './pages/advanced/contests';
import Profile from './pages/advanced/profile';
import Leaderboard from './pages/advanced/leaderboard';


function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problemlist" element={<ProblemList/>}/>
        {/*  login routes */}
        <Route path="/problems/:id"
          element={
            <ProtectedRoute>
              <Discription />
            </ProtectedRoute>
          }
        />
        {/* admin routes */}
        <Route path="/createproblem"
          element={
            <AdminRoute>
              <Newproblem />
            </AdminRoute>
          }
        />
        <Route path="/updateproblem"
          element={
            <ProtectedRoute>
              <Updateproblem />
            </ProtectedRoute>
          }
        />

         {/* Features for the next update */}
        <Route path="/contests" element={<Contest/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="leaderboard" element={<Leaderboard/>}/>
      </Routes>
    </Router>
  );
}

export default App
