import type { Task, TaskRequest } from '@/types';

  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

async function parseResponse<T>(res: Response): Promise<T> {
  if (res.status === 204 || res.status === 200) {
    const text = await res.text();
    if (!text) return undefined as unknown as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }
  if (!res.ok) {
    const errorBody = await res.text().catch(() => 'Request failed');
    throw new Error(errorBody || `Request failed with status ${res.status}`);
  }
  return undefined as unknown as T;
}

export async function getAllTasks(): Promise<Task[]> {
  console.log(`${BASE_URL}/tasks`);
  const res = await fetch(`${BASE_URL}/tasks`);
  const data = await parseResponse<Task[]>(res);
  return data ?? [];
}

export async function getTask(id: string): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`);
  return parseResponse<Task>(res);
}

export async function addTask(task: TaskRequest): Promise<string> {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return parseResponse<string>(res);
}

export async function updateTaskTitle(id: string, title: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}/title`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(title),
  });
  await parseResponse<void>(res);
}

export async function updateTaskDescription(id: string, description: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}/description`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(description),
  });
  await parseResponse<void>(res);
}

export async function updateTaskStatus(id: string, status: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(status),
  });
  await parseResponse<void>(res);
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  await parseResponse<void>(res);
}
