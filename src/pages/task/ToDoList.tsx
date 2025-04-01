import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ToDoList.css';

const API_URL = 'http://localhost:3000/tasks';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  try {
    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    return decoded.sub;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

const ToDoList: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [filter, setFilter] = useState('todos');
  const [editingTask, setEditingTask] = useState<{ id: number; description: string } | null>(null);
  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    } else {
      fetchTasks();
    }
  }, [userId, filter]);

  const fetchTasks = async () => {
    if (!userId) return;
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: filter }
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const handleCreateTask = async () => {
    if (newTaskDescription.trim()) {
      if (!userId) {
        console.error("Usuário não autenticado");
        return;
      }
      try {
        const token = localStorage.getItem('access_token');
        await axios.post(API_URL, {
          description: newTaskDescription,
          userId: userId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNewTaskDescription('');
        fetchTasks();
      } catch (error) {
        console.error("Erro ao criar tarefa:", error);
      }
    }
  };

  const handleToggleCompletion = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`${API_URL}/toggle/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao alternar conclusão:", error);
    }
  };

  const handleReopenTask = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`${API_URL}/toggle/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao reabrir tarefa:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!userId) {
      console.error("Usuário não autenticado");
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: userId }
      });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  const openEditModal = (id: number, description: string) => {
    setEditingTask({ id, description });
  };

  const handleEditSubmit = async () => {
    if (!editingTask) return;
    if (!userId) {
      console.error("Usuário não autenticado");
      return;
    }
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(`${API_URL}/${editingTask.id}`, {
        description: editingTask.description,
        status: 'pendente',
        userId: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
    }
  };

  const handleEditCancel = () => {
    setEditingTask(null);
  };

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
      <h2>Tarefas</h2>
      <button className="logout-btn" onClick={handleLogout}>Sair</button>

      <div className="task-input">
        <textarea
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
              <span className={`task-description ${task.completed ? 'completed' : ''}`}>
                {task.description}
              </span>
              {task.completed ? (
                <button className="btn-reopen" onClick={() => handleReopenTask(task.id)}>Reabrir</button>
              ) : (
                <button className="btn-complete" onClick={() => handleToggleCompletion(task.id, task.completed)}>Concluir</button>
              )}
              {!task.completed && (
                <button className="btn-edit" onClick={() => openEditModal(task.id, task.description)}>Editar</button>
              )}
              <button className="btn-delete" onClick={() => handleDeleteTask(task.id)}>Excluir</button>
            </li>
          ))
        ) : (
          <p>Não há tarefas para mostrar.</p>
        )}
      </ul>


      {editingTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Editar Tarefa</h3>
            <input
              type="text"
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({ ...editingTask, description: e.target.value })
              }
            />
            <div className="modal-buttons">
              <button onClick={handleEditSubmit}>Salvar</button>
              <button onClick={handleEditCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoList;
