import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import ToDoList from './pages/task/ToDoList';

const App: React.FC = () => {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/todo" element={<ToDoList />} />
          {/* <Route path="/" element={<div className="container"><h1>Bem-vindo!</h1></div>} /> */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
