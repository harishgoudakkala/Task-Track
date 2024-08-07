// src/App.jsx
import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './components/TaskList';
import AuthResponse from './components/Pages/AuthResponse';
import Tasks from './components/TaskList';
import SignIn from './components/SignUp';
import LoginAndSignup from './components/Pages/LoginandSignup';

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<LoginAndSignup/>} />
          <Route path="/authResponse/*" element={<AuthResponse/>} />
          <Route path="/tasks" element={<Tasks/>} />
          <Route path="/signin" element={<SignIn/>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
