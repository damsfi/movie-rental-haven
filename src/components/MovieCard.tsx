
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Film, Calendar, Star } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Movie = Tables<'movies'>;

interface MovieCardProps {
  movie: Movie;
  onRent?: (movieId: number) => void;
}

const MovieCard = ({ movie, onRent }: MovieCardProps) => {
  const getPosterUrl = (imdbId: string | null, title: string) => {
    if (imdbId) {
      // Use OMDb API poster - this is a free service
      return `https://img.omdbapi.com/?i=${imdbId}&apikey=trilogy&h=400`;
    }
    // Fallback to a placeholder service with movie title
    return `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`;
  };

  const isAvailable = movie.status === 'Available';

  return (
    <Card className="group bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-80 overflow-hidden">
          <img 
            src={getPosterUrl(movie.imdb_id, movie.title)}
            alt={`${movie.title} poster`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/300x450/2563eb/ffffff?text=${encodeURIComponent(movie.title)}`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Badge 
            className={`absolute top-3 right-3 ${isAvailable 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
            } shadow-lg`}
          >
            {movie.status}
          </Badge>
          {movie.release_year && (
            <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
              {movie.release_year}
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2 leading-tight">
              {movie.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 flex items-center">
              <Film className="w-3 h-3 mr-1" />
              Directed by {movie.director}
            </p>
          </div>
          
          {movie.release_year && (
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              Released {movie.release_year}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onRent?.(movie.movie_id)}
          disabled={!isAvailable}
          className={`w-full font-semibold ${isAvailable 
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } transition-all duration-200`}
        >
          {isAvailable ? 'Rent Movie' : 'Currently Rented'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
