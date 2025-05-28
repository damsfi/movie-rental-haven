
import { useState } from 'react';
import { movies as initialMovies, users as initialUsers, leases as initialLeases } from '../data/mockData';
import { Movie, User, Lease } from '../types/database';
import MovieCard from '../components/MovieCard';
import UserManagement from '../components/UserManagement';
import LeaseManagement from '../components/LeaseManagement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Film, Search, Users, Calendar, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [leases, setLeases] = useState<Lease[]>(initialLeases);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Available' | 'Leased'>('all');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showRentDialog, setShowRentDialog] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  
  const { toast } = useToast();

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || movie.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const availableMovies = movies.filter(m => m.status === 'Available');
  const activeLeases = leases.filter(l => l.status === 'Active');

  const handleRentMovie = (movieId: number) => {
    setSelectedMovieId(movieId);
    setShowRentDialog(true);
  };

  const confirmRent = () => {
    if (!selectedUser || !selectedMovieId) {
      toast({
        title: "Error",
        description: "Please select a user to rent the movie",
        variant: "destructive"
      });
      return;
    }

    const user = users.find(u => u.user_id === selectedUser);
    const movie = movies.find(m => m.movie_id === selectedMovieId);
    
    if (!user || !movie) return;

    // Update movie status
    setMovies(prevMovies => 
      prevMovies.map(m => 
        m.movie_id === selectedMovieId 
          ? { ...m, status: 'Leased' as const }
          : m
      )
    );

    // Create new lease
    const newLease: Lease = {
      lease_id: Math.max(...leases.map(l => l.lease_id)) + 1,
      user_id: selectedUser,
      movie_id: selectedMovieId,
      lease_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Active',
      created_at: new Date().toISOString(),
      user_name: user.name,
      movie_title: movie.title
    };

    setLeases(prevLeases => [...prevLeases, newLease]);
    setShowRentDialog(false);
    setSelectedUser(null);
    setSelectedMovieId(null);

    toast({
      title: "Success",
      description: `${movie.title} has been rented to ${user.name}`,
    });
  };

  const handleReturnMovie = (leaseId: number) => {
    const lease = leases.find(l => l.lease_id === leaseId);
    if (!lease) return;

    // Update lease status
    setLeases(prevLeases =>
      prevLeases.map(l =>
        l.lease_id === leaseId
          ? { ...l, status: 'Returned' as const, return_date: new Date().toISOString().split('T')[0] }
          : l
      )
    );

    // Update movie status
    setMovies(prevMovies =>
      prevMovies.map(m =>
        m.movie_id === lease.movie_id
          ? { ...m, status: 'Available' as const }
          : m
      )
    );
  };

  const handleAddUser = (newUserData: Omit<User, 'user_id' | 'created_at'>) => {
    const newUser: User = {
      ...newUserData,
      user_id: Math.max(...users.map(u => u.user_id)) + 1,
      created_at: new Date().toISOString()
    };
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              <span className="text-red-500">Cinema</span>Rent
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Your premium movie rental destination. Discover, rent, and enjoy the best films from our extensive collection.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Film className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{movies.length}</div>
                <div className="text-gray-400">Total Movies</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{availableMovies.length}</div>
                <div className="text-gray-400">Available</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{activeLeases.length}</div>
                <div className="text-gray-400">Active Rentals</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="movies" className="space-y-8">
          <TabsList className="bg-gray-900 border-gray-800 p-1">
            <TabsTrigger value="movies" className="data-[state=active]:bg-red-600">
              <Film className="w-4 h-4 mr-2" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-red-600">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="leases" className="data-[state=active]:bg-red-600">
              <Calendar className="w-4 h-4 mr-2" />
              Leases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Browse Movies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search movies or directors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                    <SelectTrigger className="w-full md:w-48 bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Movies</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Leased">Currently Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.movie_id}
                  movie={movie}
                  onRent={handleRentMovie}
                />
              ))}
            </div>

            {filteredMovies.length === 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-8 text-center">
                  <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No movies found matching your criteria</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={users} onAddUser={handleAddUser} />
          </TabsContent>

          <TabsContent value="leases">
            <LeaseManagement leases={leases} onReturnMovie={handleReturnMovie} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Rent Movie Dialog */}
      <Dialog open={showRentDialog} onOpenChange={setShowRentDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Rent Movie</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select a user to rent this movie to.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedUser?.toString()} onValueChange={(value) => setSelectedUser(Number(value))}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={user.user_id.toString()}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <Button onClick={confirmRent} className="flex-1 bg-red-600 hover:bg-red-700">
                Confirm Rental
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowRentDialog(false)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
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
