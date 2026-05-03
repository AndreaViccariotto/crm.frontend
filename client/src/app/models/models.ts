export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  due_date: string;
  due_time: string | null;
  user_id: number;
  status_id: number;
}

export interface User {
  id: number;
  username: string;
}

export interface CalendarEventVM {
  id: number;
  title: string;
  description: string;
  date: Date;
  time: string;
  user: string;
  user_id: number;
}