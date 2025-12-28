
export interface User {
  email: string;
  name: string;
  nickname: string;
  password?: string;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  createdAt: number;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  isActive: boolean;
  mode: 'work' | 'break';
}

export type Tab = 'timer' | 'tasks' | 'notes' | 'ai' | 'music' | 'profile';

export interface LofiTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}
