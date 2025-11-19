import { Star } from "lucide-react";
import { Badge } from "./ui/badge";

interface MediaCardProps {
  title: string;
  image: string;
  type: "movie" | "series" | "game";
  rating: number;
  year: string;
}

export const MediaCard = ({ title, image, type, rating, year }: MediaCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-sm border-2 border-border brutal-shadow-hover transition-all duration-300">
        <img
          src={image}
          alt={title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <Badge variant="secondary" className="mb-2">
              {type}
            </Badge>
            <h3 className="font-heading font-bold text-white text-lg line-clamp-2">
              {title}
            </h3>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold line-clamp-1">{title}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="mono text-muted-foreground">{year}</span>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-primary text-primary" />
            <span className="font-semibold">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
