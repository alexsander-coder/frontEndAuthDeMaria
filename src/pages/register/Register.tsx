import React, { useState } from 'react';
import { register } from '../../api/auth';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await register(email, password);
      console.log("Usuário cadastrado:", response.data);
      navigate('/login');
    } catch (err) {
      setError('Falha ao cadastrar usuário');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2>Cadastrar</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Cadastrar</button>
      </form>

      <p>
        Já tem uma conta?{' '}
        <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
};

export default Register;
