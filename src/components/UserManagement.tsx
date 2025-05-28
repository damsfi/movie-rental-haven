
import { useState } from 'react';
import { User } from '../types/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, Plus, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserManagementProps {
  users: User[];
  onAddUser: (user: Omit<User, 'user_id' | 'created_at'>) => void;
}

const UserManagement = ({ users, onAddUser }: UserManagementProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    contact_info: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    onAddUser(newUser);
    setNewUser({ name: '', email: '', contact_info: '' });
    setShowAddForm(false);
    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <UserIcon className="w-6 h-6 mr-2 text-red-500" />
          User Management
        </h2>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Add New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="contact" className="text-gray-300">Contact Info</Label>
                <Input
                  id="contact"
                  value={newUser.contact_info}
                  onChange={(e) => setNewUser({ ...newUser, contact_info: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  Add User
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.user_id} className="bg-gray-900 border-gray-800 hover:border-red-500 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{user.name}</h3>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300 mt-1">
                    ID: {user.user_id}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-gray-400 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
                {user.contact_info && (
                  <div className="flex items-center text-gray-400 text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    {user.contact_info}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
