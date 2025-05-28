import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Use the generated types from Supabase
type User = Tables<'users'>;
type Movie = Tables<'movies'>;
type Lease = Tables<'leases'> & {
  user_name?: string;
  movie_title?: string;
};

export const useSupabaseData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) throw usersError;
      setUsers(usersData || []);

      const { data: moviesData, error: moviesError } = await supabase
        .from('movies')
        .select('*');

      if (moviesError) throw moviesError;
      setMovies(moviesData || []);

      const { data: leasesData, error: leasesError } = await supabase
        .from('leases')
        .select(`
          *,
          users(name),
          movies(title)
        `);

      if (leasesError) throw leasesError;

      const enrichedLeases = leasesData?.map(lease => ({
        ...lease,
        user_name: lease.users?.name,
        movie_title: lease.movies?.title
      })) || [];

      setLeases(enrichedLeases as Lease[]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addUser = async (userData: Omit<User, 'user_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      
      setUsers(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err instanceof Error ? err.message : 'Failed to add user');
      throw err;
    }
  };

  const rentMovie = async (movieId: number, userId: number) => {
    try {
      // Update movie status
      const { error: movieError } = await supabase
        .from('movies')
        .update({ status: 'Leased' })
        .eq('movie_id', movieId);

      if (movieError) throw movieError;

      // Create lease
      const leaseDate = new Date().toISOString().split('T')[0];
      const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const { data: leaseData, error: leaseError } = await supabase
        .from('leases')
        .insert([{
          user_id: userId,
          movie_id: movieId,
          lease_date: leaseDate,
          due_date: dueDate,
          status: 'Active'
        }])
        .select(`
          *,
          users(name),
          movies(title)
        `)
        .single();

      if (leaseError) throw leaseError;

      // Update local state
      setMovies(prev => prev.map(m => 
        m.movie_id === movieId ? { ...m, status: 'Leased' as const } : m
      ));

      const newLease: Lease = {
        ...leaseData,
        user_name: leaseData.users?.name,
        movie_title: leaseData.movies?.title
      };

      setLeases(prev => [...prev, newLease]);
      return newLease;
    } catch (err) {
      console.error('Error renting movie:', err);
      setError(err instanceof Error ? err.message : 'Failed to rent movie');
      throw err;
    }
  };

  const returnMovie = async (leaseId: number) => {
    try {
      const lease = leases.find(l => l.lease_id === leaseId);
      if (!lease) throw new Error('Lease not found');

      // Update lease
      const { error: leaseError } = await supabase
        .from('leases')
        .update({ 
          status: 'Returned',
          return_date: new Date().toISOString().split('T')[0]
        })
        .eq('lease_id', leaseId);

      if (leaseError) throw leaseError;

      // Update movie status
      const { error: movieError } = await supabase
        .from('movies')
        .update({ status: 'Available' })
        .eq('movie_id', lease.movie_id);

      if (movieError) throw movieError;

      // Update local state
      setLeases(prev => prev.map(l => 
        l.lease_id === leaseId 
          ? { ...l, status: 'Returned' as const, return_date: new Date().toISOString().split('T')[0] }
          : l
      ));

      setMovies(prev => prev.map(m => 
        m.movie_id === lease.movie_id ? { ...m, status: 'Available' as const } : m
      ));
    } catch (err) {
      console.error('Error returning movie:', err);
      setError(err instanceof Error ? err.message : 'Failed to return movie');
      throw err;
    }
  };

  return {
    users,
    movies,
    leases,
    loading,
    error,
    addUser,
    rentMovie,
    returnMovie,
    refetch: fetchData
  };
};
