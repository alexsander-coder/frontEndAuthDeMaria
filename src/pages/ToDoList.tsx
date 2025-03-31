import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { isAuthenticated } from '../utils/auth';

const API_URL = 'http://localhost:3000/tasks';
const USER_ID = 3;

const getUserIdFromToken = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;

  const decoded: any = JSON.parse(atob(token.split('.')[1]));
  return decoded.sub;
};

const ToDoList: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:3000/tasks/3', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const handleCreateTask = async () => {
    if (newTaskDescription.trim()) {
      try {
        await axios.post(API_URL, {
          description: newTaskDescription,
          userId: USER_ID,
        });
        setNewTaskDescription('');
        fetchTasks();
      } catch (error) {
        console.error('Erro ao criar tarefa:', error);
      }
    }
  };

  const handleToggleCompletion = async (id: number) => {
    try {
      await axios.patch(`${API_URL}/toggle/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao alternar conclusão:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleEditTask = async (id: number, description: string) => {
    const newDescription = prompt('Editar Tarefa', description);
    if (newDescription !== null) {
      try {
        await axios.patch(`${API_URL}/${id}`, {
          description: newDescription,
          status: 'pendente',
        });
        fetchTasks();
      } catch (error) {
        console.error('Erro ao editar tarefa:', error);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>

      <div className="task-input">
        <input
          type="text"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Digite a descrição da tarefa"
        />
        <button onClick={handleCreateTask}>Criar Tarefa</button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter('todos')}>Todos</button>
        <button onClick={() => setFilter('pendente')}>Pendentes</button>
        <button onClick={() => setFilter('concluída')}>Concluídas</button>
      </div>

      <ul>
        {tasks.length > 0 ? (
          tasks.map((task: any) => (
            <li key={task.id} className="task-item">
              <span
                className={`task-description ${task.completed ? 'completed' : ''}`}
                onClick={() => handleToggleCompletion(task.id)}
              >
                {task.description}
              </span>
              <button onClick={() => handleEditTask(task.id, task.description)}>Editar</button>
              <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
            </li>
          ))
        ) : (
          <p>Não há tarefas para mostrar.</p>
        )}
      </ul>
    </div>
  );
};

export default ToDoList;