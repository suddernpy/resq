import Image from "next/image";
import { MapPin, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: {
    id: string;
    name: string;
    description?: string;
    location?: string;
    distance?: string;
    timeLeft?: string;
    image?: string;
    tags?: string[];
  };
  onClick?: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const isEndingSoon =
    listing.timeLeft && !isNaN(parseInt(listing.timeLeft)) && parseInt(listing.timeLeft) <= 15; // Ensure timeLeft is a valid number
  const hasNoDescription = !listing.description || listing.description.trim() === "";

  return (
    <div
      onClick={onClick}
      className="group flex bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-shadow duration-200 overflow-hidden hover:shadow-md cursor-pointer"
    >
      {/* Image Section */}
      <div className="w-32 h-32 relative flex-shrink-0 bg-gray-100">
        <Image
          src={listing.image || "/placeholder.svg"}
          alt={listing.name || "Listing Image"}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex-grow p-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
            {listing.name || "Unnamed Listing"}
          </h3>
          {isEndingSoon && (
            <Badge variant="destructive" className="text-xs">
              Ending Soon
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-1">
          {listing.description || "No description provided."}
        </p>
        {hasNoDescription && (
          <div className="flex items-center text-yellow-600 text-xs mt-1">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span>This description is AI-generated.</span>
          </div>
        )}

        {/* Details Section */}
        <div className="flex flex-wrap justify-between items-center mt-3 text-sm text-gray-600">
          {listing.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1.5" />
              <span>{listing.location}</span>
            </div>
          )}
          {listing.timeLeft && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{listing.timeLeft}</span>
            </div>
          )}
        </div>

        {/* Tags Section */}
        {listing.tags && listing.tags.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {listing.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  tag.toLowerCase() === "veg" &&
                    "bg-green-100 text-green-800 hover:bg-green-200",
                  tag.toLowerCase() === "halal" &&
                    "bg-blue-100 text-blue-800 hover:bg-blue-200",
                  tag.toLowerCase() === "beef" &&
                    "bg-red-100 text-red-800 hover:bg-red-200",
                  tag.toLowerCase() === "pork" &&
                    "bg-orange-100 text-orange-800 hover:bg-orange-200"
                )}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
