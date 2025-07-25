import { useState } from 'react'
import { useSelector } from 'react-redux';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/auth/Registration';
import Home from './pages/home'
import Login from './pages/auth/login'
import Newproblem from './pages/problems/createproblem'
import Problemlist from './pages/problems/problemlist'
import { ProtectedRoute, AdminRoute } from './features/protectedRoute';
import Frontpage from './pages/frontpage';
import Discription from './pages/problems/Discription';

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* temp routes for dev purposes only */}
        {/* <Route path='/problems/:problemID' element={<Discription/>}/> */}
        <Route path='/problemlist' element={<Problemlist/>}/>
        <Route path='/createproblem' element={<Newproblem />}/>
        <Route path="/problems/:id" element={<Discription/>}/>


        {/* admin and login routes */}
        {/* <Route
          path="/createproblem"
          element={
            <AdminRoute>
              <Newproblem />
            </AdminRoute>
          }
        /> */}
        {/* <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/problemlist"
          element={
            <ProtectedRoute>
              <Problemlist />
            </ProtectedRoute>
          }
        /> */}
      </Routes> ø
    </Router>
  );
}

export default App
