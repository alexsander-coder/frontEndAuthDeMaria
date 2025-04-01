import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { isAuthenticated } from '../utils/auth';

const API_URL = 'http://localhost:3000/tasks';
//teste fixo
// const USER_ID = 3;


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
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      navigate('/login'); // se nao estiver autenticado redireciona para o login
    } else {
      fetchTasks();
    }
  }, [userId, filter]);

  const fetchTasks = async () => {
    if (!userId) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://localhost:3000/tasks/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { status: filter },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const handleCreateTask = async () => {
    if (newTaskDescription.trim()) {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error('Usuário não autenticado');
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        await axios.post(API_URL, {
          description: newTaskDescription,
          userId: userId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNewTaskDescription('');
        fetchTasks();
      } catch (error) {
        console.error('Erro ao criar tarefa:', error);
      }
    }
  };

  const handleToggleCompletion = async (id: number, currentStatus: boolean) => {
    console.log('Botão clicado! ID:', id, 'Status atual:', currentStatus);

    try {
      const token = localStorage.getItem('access_token');

      await axios.patch(`${API_URL}/toggle/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
    } catch (error) {
      console.error('Erro ao alternar conclusão:', error);
    }
  };


  const handleReopenTask = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`${API_URL}/toggle/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
    } catch (error) {
      console.error('Erro ao reabrir tarefa:', error);
    }
  };






  const handleDeleteTask = async (id: number) => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId: userId },
      });
      fetchTasks();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };


  const handleEditTask = async (id: number, description: string) => {
    const newDescription = prompt('Editar Tarefa', description);
    if (newDescription !== null) {
      const userId = getUserIdFromToken(); // id do usuario do token jwrt
      if (!userId) {
        console.error('Usuário não autenticado');
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        await axios.patch(`${API_URL}/${id}`, {
          description: newDescription,
          status: 'pendente',
          userId: userId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchTasks();
      } catch (error) {
        console.error('Erro ao editar tarefa:', error);
      }
    }
  };


  // useEffect(() => {
  //   fetchTasks();
  // }, [filter]);

  const filteredTasks = tasks.filter((task: any) => {
    if (filter === 'todos') return true;
    if (filter === 'pendente' && !task.completed) return true;
    if (filter === 'concluída' && task.completed) return true;
    return false;
  });

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>

      <button className="logout-btn" onClick={handleLogout}>Sair</button>


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
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task: any) => (
            <li key={task.id} className="task-item">
              <span
                className={`task-description ${task.completed ? 'completed' : ''}`}
              >
                {task.description}
              </span>

              {task.completed && (
                <button onClick={() => handleReopenTask(task.id)}>
                  Reabrir
                </button>
              )}

              {!task.completed && (
                <button onClick={() => handleToggleCompletion(task.id, task.completed)}>
                  Concluir
                </button>
              )}

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