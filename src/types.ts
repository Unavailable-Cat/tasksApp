export interface Task {
  id: string;
  title: string;
  description: string;
  status: boolean;
}

export interface TaskRequest {
  title: string;
  description: string;
}
