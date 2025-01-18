import Image from "next/image"
import { MapPin, Clock, AlertTriangle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ListingCardProps {
  listing: {
    id: string
    name: string
    description: string
    location: string
    distance: string
    timeLeft: string
    tags: string[]
    image: string
  }
  onClick?: () => void
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const isEndingSoon = parseInt(listing.timeLeft) <= 15;
  const hasNoDescription = listing.description.trim() === '';

  return (
    <div 
      onClick={onClick}
      className="group flex bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-200 overflow-hidden hover:shadow-md cursor-pointer"
    >
      <div className="w-32 h-32 relative flex-shrink-0">
        <Image
          src={listing.image || "/placeholder.svg"}
          alt={listing.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-grow p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">
            {listing.name}
          </h3>
          <div className="flex gap-2">
            {isEndingSoon && (
              <Badge variant="destructive" className="text-xs">
                Ending Soon
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {listing.description || "No description provided."}
        </p>
        {hasNoDescription && (
          <div className="flex items-center text-yellow-600 text-xs mt-1">
            <AlertTriangle className="w-3 h-3 mr-1" />
            <span>This description is AI-generated.</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1.5" />
              <span>{listing.location}</span>
              <span className="text-xs text-gray-500 ml-1.5">({listing.distance})</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{listing.timeLeft} left</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          {listing.tags.map((tag) => (
            <Badge 
              key={tag}
              variant="secondary"
              className={cn(
                "text-xs font-medium",
                tag.toLowerCase() === "veg" && "bg-green-100 text-green-800 hover:bg-green-200",
                tag.toLowerCase() === "halal" && "bg-blue-100 text-blue-800 hover:bg-blue-200",
                tag.toLowerCase() === "beef" && "bg-red-100 text-red-800 hover:bg-red-200",
                tag.toLowerCase() === "pork" && "bg-orange-100 text-orange-800 hover:bg-orange-200"
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

