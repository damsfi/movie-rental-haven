
import { Movie } from '../types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Film, Calendar } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onRent?: (movieId: number) => void;
}

const MovieCard = ({ movie, onRent }: MovieCardProps) => {
  const generatePosterUrl = (imdbId: string, title: string) => {
    // Create a placeholder poster based on movie title
    const colors = ['from-red-500', 'from-blue-500', 'from-green-500', 'from-purple-500', 'from-yellow-500'];
    const colorIndex = title.length % colors.length;
    return colors[colorIndex];
  };

  const isAvailable = movie.status === 'Available';

  return (
    <Card className="group bg-gray-900 border-gray-800 hover:border-red-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
      <CardContent className="p-0">
        <div className={`h-64 bg-gradient-to-br ${generatePosterUrl(movie.imdb_id, movie.title)} to-gray-800 rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
          <Film className="w-16 h-16 text-white/30" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
          <Badge 
            className={`absolute top-3 right-3 ${isAvailable ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {movie.status}
          </Badge>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors duration-300 line-clamp-2">
              {movie.title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">
              Directed by {movie.director}
            </p>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {movie.release_year}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onRent?.(movie.movie_id)}
          disabled={!isAvailable}
          className={`w-full ${isAvailable 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'Rent Now' : 'Currently Rented'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
