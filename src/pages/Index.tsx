
import { useState } from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import type { Tables } from '@/integrations/supabase/types';
import MovieCard from '../components/MovieCard';
import UserManagement from '../components/UserManagement';
import LeaseManagement from '../components/LeaseManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Film, Search, Users, Calendar, TrendingUp, ArrowUpDown, Loader2, Building2, Star, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type User = Tables<'users'>;
type Movie = Tables<'movies'>;
type Lease = Tables<'leases'> & {
  user_name?: string;
  movie_title?: string;
};

const Index = () => {
  const { users, movies, leases, loading, error, addUser, rentMovie, returnMovie } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Available' | 'Leased'>('all');
  const [movieSortBy, setMovieSortBy] = useState<'title' | 'director' | 'release_year' | 'status'>('title');
  const [leaseSortBy, setLeaseSortBy] = useState<'lease_date' | 'due_date' | 'user_name' | 'status'>('lease_date');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showRentDialog, setShowRentDialog] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  
  const { toast } = useToast();

  const sortMovies = (movies: Movie[], sortBy: string) => {
    return [...movies].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'director':
          return a.director.localeCompare(b.director);
        case 'release_year':
          return (b.release_year || 0) - (a.release_year || 0); // Newest first
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });
  };

  const sortLeases = (leases: Lease[], sortBy: string) => {
    return [...leases].sort((a, b) => {
      switch (sortBy) {
        case 'lease_date':
          return new Date(b.lease_date).getTime() - new Date(a.lease_date).getTime(); // Newest first
        case 'due_date':
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime(); // Soonest first
        case 'user_name':
          return (a.user_name || '').localeCompare(b.user_name || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });
  };

  const filteredMovies = sortMovies(
    movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           movie.director.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || movie.status === statusFilter;
      return matchesSearch && matchesStatus;
    }),
    movieSortBy
  );

  const sortedLeases = sortLeases(leases, leaseSortBy);

  const handleRentMovie = (movieId: number) => {
    setSelectedMovieId(movieId);
    setShowRentDialog(true);
  };

  const confirmRent = async () => {
    if (!selectedUser || !selectedMovieId) {
      toast({
        title: "Error",
        description: "Please select a customer to rent the movie",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = users.find(u => u.user_id === selectedUser);
      const movie = movies.find(m => m.movie_id === selectedMovieId);
      
      await rentMovie(selectedMovieId, selectedUser);
      
      setShowRentDialog(false);
      setSelectedUser(null);
      setSelectedMovieId(null);

      toast({
        title: "Rental Successful",
        description: `${movie?.title} has been rented to ${user?.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process rental. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReturnMovie = async (leaseId: number) => {
    try {
      const lease = leases.find(l => l.lease_id === leaseId);
      await returnMovie(leaseId);
      
      toast({
        title: "Return Processed",
        description: `${lease?.movie_title} has been successfully returned`,
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to process return. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddUser = async (newUserData: Omit<User, 'user_id' | 'created_at'>) => {
    try {
      await addUser(newUserData);
      toast({
        title: "Customer Added",
        description: "New customer has been successfully registered",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your rental catalog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700 text-lg mb-4 font-medium">System Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = leases.filter(l => l.status === 'Returned').length * 5.99; // Assuming $5.99 per rental

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Professional Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CinemaRent Pro</h1>
                <p className="text-gray-600">Professional Movie Rental Management System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Business Dashboard</p>
              <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Metrics Dashboard */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Film className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">{movies.length}</div>
              <div className="text-gray-600 font-medium">Total Inventory</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">{movies.filter(m => m.status === 'Available').length}</div>
              <div className="text-gray-600 font-medium">Available Now</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Calendar className="w-10 h-10 text-orange-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">{leases.filter(l => l.status === 'Active').length}</div>
              <div className="text-gray-600 font-medium">Active Rentals</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-10 h-10 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</div>
              <div className="text-gray-600 font-medium">Total Revenue</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="movies" className="space-y-8">
          <TabsList className="bg-white shadow-md border p-1 rounded-lg">
            <TabsTrigger value="movies" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium">
              <Film className="w-4 h-4 mr-2" />
              Movie Catalog
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium">
              <Users className="w-4 h-4 mr-2" />
              Customer Management
            </TabsTrigger>
            <TabsTrigger value="leases" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Rental Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white shadow-md">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  Movie Catalog Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by title or director..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-full md:w-48 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Filter by availability" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="all">All Movies</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Leased">Currently Rented</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={movieSortBy} onValueChange={(value) => setMovieSortBy(value as any)}>
                    <SelectTrigger className="w-full md:w-48 border-gray-300 focus:border-blue-500">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="title">Title (A-Z)</SelectItem>
                      <SelectItem value="director">Director (A-Z)</SelectItem>
                      <SelectItem value="release_year">Year (Newest)</SelectItem>
                      <SelectItem value="status">Availability</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  movie={movie}
                  onRent={handleRentMovie}
                />
              ))}
            </div>

            {filteredMovies.length === 0 && (
              <Card className="bg-white shadow-md">
                <CardContent className="p-12 text-center">
                  <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Movies Found</h3>
                  <p className="text-gray-600">No movies match your current search criteria</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={users} onAddUser={handleAddUser} />
          </TabsContent>

          <TabsContent value="leases">
            <LeaseManagement leases={sortedLeases} onReturnMovie={handleReturnMovie} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Professional Rent Dialog */}
      <Dialog open={showRentDialog} onOpenChange={setShowRentDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl font-semibold">Process Rental</DialogTitle>
            <DialogDescription className="text-gray-600">
              Select a customer to complete this rental transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedUser?.toString()} onValueChange={(value) => setSelectedUser(Number(value))}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="Choose customer" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-sm text-gray-500">{user.email}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-3">
              <Button onClick={confirmRent} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Complete Rental
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowRentDialog(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
