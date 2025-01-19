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
    listing.timeLeft &&
    !isNaN(parseInt(listing.timeLeft)) &&
    parseInt(listing.timeLeft) <= 15;
  const hasNoDescription = !listing.description || listing.description.trim() === "";

  return (
    <div
      onClick={onClick}
      className="group flex bg-white rounded-lg border border-gray-200 hover:border-[#1751d6]/20 transition-all duration-200 overflow-hidden hover:shadow-md cursor-pointer"
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
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#1751d6] transition-colors">
              {listing.name || "Unnamed Listing"}
            </h3>
            <p className="text-gray-600 mt-1 text-sm">
              {listing.description || "No description provided."}
            </p>
            {hasNoDescription && (
              <div className="flex items-center text-yellow-600 text-xs mt-1">
                <AlertTriangle className="w-3 h-3 mr-1" />
                <span>This description is AI-generated.</span>
              </div>
            )}
          </div>
          {isEndingSoon && (
            <Badge variant="destructive" className="text-xs shrink-0">
              Ending Soon
            </Badge>
          )}
        </div>

        {/* Location and Time */}
        <div className="flex items-center gap-4 mt-3">
          {listing.location && (
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{listing.location}</span>
              {listing.distance && (
                <span className="text-gray-400 ml-1">({listing.distance})</span>
              )}
            </div>
          )}
          {listing.timeLeft && (
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
              <span>{listing.timeLeft} left</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {listing.tags && listing.tags.length > 0 && (
  <div className="flex gap-2 mt-2">
    {listing.tags.map((tag) => (
      <Badge
        key={tag}
        variant="secondary"
        className={cn(
          "text-xs font-medium px-2.5 py-0.5",
          tag.toLowerCase() === "veg" && "bg-green-100 text-green-800 hover:bg-green-200",
          tag.toLowerCase() === "halal" && "bg-[#DBEAFE] text-[#1751d6] hover:bg-blue-200",
          tag.toLowerCase() === "beef" && "bg-red-100 text-red-800 hover:bg-red-200",
          tag.toLowerCase() === "pork" && "bg-orange-100 text-orange-800 hover:bg-orange-200"
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
