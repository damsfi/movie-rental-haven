
import { User, Movie, Lease } from '../types/database';

export const users: User[] = [
  {
    user_id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    contact_info: '555-1234',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    user_id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    contact_info: '555-5678',
    created_at: '2024-01-16T14:20:00Z'
  },
  {
    user_id: 3,
    name: 'Carol Davis',
    email: 'carol@example.com',
    contact_info: '555-9876',
    created_at: '2024-01-17T09:15:00Z'
  }
];

export const movies: Movie[] = [
  {
    movie_id: 1,
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont',
    imdb_id: 'tt0111161',
    release_year: 1994,
    status: 'Leased',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 2,
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    imdb_id: 'tt0068646',
    release_year: 1972,
    status: 'Leased',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 3,
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    imdb_id: 'tt0468569',
    release_year: 2008,
    status: 'Leased',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 4,
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    imdb_id: 'tt0110912',
    release_year: 1994,
    status: 'Leased',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 5,
    title: 'Forrest Gump',
    director: 'Robert Zemeckis',
    imdb_id: 'tt0109830',
    release_year: 1994,
    status: 'Leased',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 6,
    title: 'Inception',
    director: 'Christopher Nolan',
    imdb_id: 'tt1375666',
    release_year: 2010,
    status: 'Leased',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 7,
    title: 'Fight Club',
    director: 'David Fincher',
    imdb_id: 'tt0137523',
    release_year: 1999,
    status: 'Leased',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 8,
    title: 'The Matrix',
    director: 'Lana Wachowski, Lilly Wachowski',
    imdb_id: 'tt0133093',
    release_year: 1999,
    status: 'Available',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 9,
    title: 'Goodfellas',
    director: 'Martin Scorsese',
    imdb_id: 'tt0099685',
    release_year: 1990,
    status: 'Available',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 10,
    title: 'The Lord of the Rings: The Return of the King',
    director: 'Peter Jackson',
    imdb_id: 'tt0167260',
    release_year: 2003,
    status: 'Available',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 11,
    title: 'The Empire Strikes Back',
    director: 'Irvin Kershner',
    imdb_id: 'tt0080684',
    release_year: 1980,
    status: 'Available',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 12,
    title: 'Interstellar',
    director: 'Christopher Nolan',
    imdb_id: 'tt0816692',
    release_year: 2014,
    status: 'Available',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 13,
    title: 'Parasite',
    director: 'Bong Joon-ho',
    imdb_id: 'tt6751668',
    release_year: 2019,
    status: 'Available',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 14,
    title: 'Gladiator',
    director: 'Ridley Scott',
    imdb_id: 'tt0172495',
    release_year: 2000,
    status: 'Available',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    movie_id: 15,
    title: 'Titanic',
    director: 'James Cameron',
    imdb_id: 'tt0120338',
    release_year: 1997,
    status: 'Available',
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const leases: Lease[] = [
  {
    lease_id: 1,
    user_id: 1,
    movie_id: 1,
    lease_date: '2024-05-28',
    due_date: '2024-06-11',
    status: 'Active',
    created_at: '2024-05-28T10:00:00Z',
    user_name: 'Alice Johnson',
    movie_title: 'The Shawshank Redemption'
  },
  {
    lease_id: 2,
    user_id: 2,
    movie_id: 2,
    lease_date: '2024-05-28',
    due_date: '2024-06-11',
    status: 'Active',
    created_at: '2024-05-28T11:00:00Z',
    user_name: 'Bob Smith',
    movie_title: 'The Godfather'
  },
  {
    lease_id: 3,
    user_id: 3,
    movie_id: 3,
    lease_date: '2024-05-28',
    due_date: '2024-06-11',
    status: 'Active',
    created_at: '2024-05-28T12:00:00Z',
    user_name: 'Carol Davis',
    movie_title: 'The Dark Knight'
  },
  {
    lease_id: 4,
    user_id: 1,
    movie_id: 4,
    lease_date: '2024-05-28',
    due_date: '2024-06-11',
    status: 'Active',
    created_at: '2024-05-28T13:00:00Z',
    user_name: 'Alice Johnson',
    movie_title: 'Pulp Fiction'
  },
  {
    lease_id: 5,
    user_id: 2,
    movie_id: 5,
    lease_date: '2024-05-28',
    due_date: '2024-06-11',
    status: 'Active',
    created_at: '2024-05-28T14:00:00Z',
    user_name: 'Bob Smith',
    movie_title: 'Forrest Gump'
  },
  {
    lease_id: 6,
    user_id: 3,
    movie_id: 6,
    lease_date: '2024-05-28',
    due_date: '2024-06-11',
    status: 'Active',
    created_at: '2024-05-28T15:00:00Z',
    user_name: 'Carol Davis',
    movie_title: 'Inception'
  },
  {
    lease_id: 7,
    user_id: 1,
    movie_id: 7,
    lease_date: '2024-05-28',
    due_date: '2024-06-11',
    status: 'Active',
    created_at: '2024-05-28T16:00:00Z',
    user_name: 'Alice Johnson',
    movie_title: 'Fight Club'
  }
];
