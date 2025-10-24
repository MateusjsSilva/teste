import { getAuthHeader } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  due_date?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  due_date?: string;
}

export class TaskService {
  private static getHeaders(): HeadersInit {
    const authHeader = getAuthHeader();
    return {
      'Content-Type': 'application/json',
      ...authHeader,
    };
  }

  static async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'GET',
        headers: this.getHeaders(),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar tarefas: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw error;
    }
  }

  static async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro ao criar tarefa: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  }

  static async getTaskById(id: number): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar tarefa: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      throw error;
    }
  }

  static async updateTask(id: number, data: UpdateTaskData): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro ao atualizar tarefa: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }

  static async deleteTask(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir tarefa: ${response.status}`);
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    }
  }

  static async updateTaskStatus(id: number, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'): Promise<Task> {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}/status`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Erro ao atualizar status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }
}
