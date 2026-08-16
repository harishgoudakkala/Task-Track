// src/App.jsx
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './components/TaskList';
import AuthResponse from './components/Pages/AuthResponse';
import Tasks from './components/TaskList';
import SignUp from './components/SignUp';
import Login from './components/Login'

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<SignUp/>} />
          <Route path="/authResponse/*" element={<AuthResponse/>} />
          <Route path="/tasks" element={<Tasks/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/login" element={<Login/>} />
          </Routes>
      </Container>
    </Router>
  );
}

export default App;
