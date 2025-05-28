
import { Lease } from '../types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Film, Clock, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface LeaseManagementProps {
  leases: Lease[];
  onReturnMovie: (leaseId: number) => void;
}

const LeaseManagement = ({ leases, onReturnMovie }: LeaseManagementProps) => {
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<'lease_date' | 'due_date' | 'user_name' | 'status'>('lease_date');

  const handleReturn = (leaseId: number, movieTitle: string) => {
    onReturnMovie(leaseId);
    toast({
      title: "Movie Returned",
      description: `${movieTitle} has been successfully returned`,
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string, daysUntilDue: number) => {
    if (status === 'Returned') return 'bg-green-600';
    if (status === 'Overdue' || daysUntilDue < 0) return 'bg-red-600';
    if (daysUntilDue <= 3) return 'bg-yellow-600';
    return 'bg-blue-600';
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
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  };

  const activeLeases = leases.filter(lease => lease.status === 'Active');
  const sortedActiveLeases = sortLeases(activeLeases, sortBy);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-red-500" />
          Active Leases
        </h2>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="lease_date">Lease Date (Newest)</SelectItem>
            <SelectItem value="due_date">Due Date (Soonest)</SelectItem>
            <SelectItem value="user_name">User Name (A-Z)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedActiveLeases.map((lease) => {
          const daysUntilDue = getDaysUntilDue(lease.due_date);
          const statusColor = getStatusColor(lease.status, daysUntilDue);
          
          return (
            <Card key={lease.lease_id} className="bg-gray-900 border-gray-800 hover:border-red-500 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg flex items-center">
                    <Film className="w-5 h-5 mr-2 text-red-500" />
                    {lease.movie_title}
                  </CardTitle>
                  <Badge className={statusColor}>
                    {daysUntilDue >= 0 ? `${daysUntilDue} days left` : `${Math.abs(daysUntilDue)} days overdue`}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-400 text-sm">
                  <User className="w-4 h-4 mr-2" />
                  {lease.user_name}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Lease Date</p>
                    <p className="text-white flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(lease.lease_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Due Date</p>
                    <p className="text-white flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(lease.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleReturn(lease.lease_id, lease.movie_title || 'Movie')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Mark as Returned
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {sortedActiveLeases.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No active leases at the moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaseManagement;
