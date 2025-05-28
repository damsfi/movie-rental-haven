
export interface User {
  user_id: number;
  name: string;
  email: string;
  contact_info: string;
  created_at: string;
}

export interface Movie {
  movie_id: number;
  title: string;
  director: string;
  imdb_id: string;
  release_year: number;
  status: 'Available' | 'Leased';
  created_at: string;
}

export interface Lease {
  lease_id: number;
  user_id: number;
  movie_id: number;
  lease_date: string;
  due_date: string;
  return_date?: string;
  status: 'Active' | 'Returned' | 'Overdue';
  created_at: string;
  user_name?: string;
  movie_title?: string;
}
