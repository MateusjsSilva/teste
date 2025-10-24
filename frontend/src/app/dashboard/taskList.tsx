"use client";

import { useState, useEffect } from 'react';
import { Task, TaskService } from '@/lib/taskService';
import { statusLabels, priorityLabels, statusColors, priorityColors } from '@/lib/taskSchemas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskListProps {
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
  onStatusChange?: (taskId: number, status: Task['status']) => void;
}

export function TaskList({ onEdit, onDelete, onStatusChange }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await TaskService.getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleStatusChange = async (taskId: number, newStatus: Task['status']) => {
    try {
      await TaskService.updateTaskStatus(taskId, newStatus);
      await loadTasks(); // Recarrega a lista
      onStatusChange?.(taskId, newStatus);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await TaskService.deleteTask(taskId);
        await loadTasks(); // Recarrega a lista
        onDelete?.(taskId);
      } catch (err) {
        console.error('Erro ao excluir tarefa:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando tarefas...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadTasks}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma tarefa encontrada.</p>
        <p className="text-gray-400 text-sm mt-1">Crie sua primeira tarefa clicando no botão acima.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
                  {statusLabels[task.status]}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[task.priority]}`}>
                  {priorityLabels[task.priority]}
                </span>
              </div>
              
              {task.description && (
                <p className="text-gray-600 text-sm mb-2">{task.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  Criada em: {format(new Date(task.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </span>
                {task.due_date && (
                  <span>
                    Vence em: {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="PENDING">Pendente</option>
                <option value="IN_PROGRESS">Em Progresso</option>
                <option value="COMPLETED">Concluída</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
              
              <button
                onClick={() => onEdit?.(task)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Editar
              </button>
              
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
