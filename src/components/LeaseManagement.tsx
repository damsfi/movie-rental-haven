
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Film, Clock, ArrowUpDown, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Tables } from '@/integrations/supabase/types';

type Lease = Tables<'leases'> & {
  user_name?: string;
  movie_title?: string;
};

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
      title: "Return Processed",
      description: `${movieTitle} has been successfully returned to inventory`,
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string | null, daysUntilDue: number) => {
    if (status === 'Returned') return 'bg-green-600 text-white';
    if (status === 'Overdue' || daysUntilDue < 0) return 'bg-red-600 text-white';
    if (daysUntilDue <= 3) return 'bg-yellow-600 text-white';
    return 'bg-blue-600 text-white';
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

  const activeLeases = leases.filter(lease => lease.status === 'Active');
  const sortedActiveLeases = sortLeases(activeLeases, sortBy);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-blue-600" />
            Active Rental Management
          </h2>
          <p className="text-gray-600 mt-1">Monitor and manage current movie rentals</p>
        </div>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
          <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300 focus:border-blue-500">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="lease_date">Rental Date (Newest)</SelectItem>
            <SelectItem value="due_date">Due Date (Soonest)</SelectItem>
            <SelectItem value="user_name">Customer Name (A-Z)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedActiveLeases.map((lease) => {
          const daysUntilDue = getDaysUntilDue(lease.due_date);
          const statusColor = getStatusColor(lease.status, daysUntilDue);
          
          return (
            <Card key={lease.lease_id} className="bg-white shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-gray-900 text-lg flex items-center">
                    <Film className="w-5 h-5 mr-2 text-blue-600" />
                    {lease.movie_title}
                  </CardTitle>
                  <Badge className={statusColor}>
                    {daysUntilDue >= 0 ? `${daysUntilDue} days left` : `${Math.abs(daysUntilDue)} days overdue`}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center text-gray-700 font-medium">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  {lease.user_name}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500 font-medium">Rental Date</p>
                    <p className="text-gray-900 flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(lease.lease_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-500 font-medium">Due Date</p>
                    <p className="text-gray-900 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(lease.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleReturn(lease.lease_id, lease.movie_title || 'Movie')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Process Return
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {sortedActiveLeases.length === 0 && (
        <Card className="bg-white shadow-md border border-gray-200">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Rentals</h3>
            <p className="text-gray-600">All movies are currently available for rental</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaseManagement;
