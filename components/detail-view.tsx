'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react'
import { cn } from "@/lib/utils"

interface DetailViewProps {
  isOpen: boolean
  onClose: () => void
  listing: {
    id: string
    name: string
    description: string
    location: string
    distance: string
    timeLeft: string
    tags: string[]
    images: string[]
    availableUntil: string
  }
}

export function DetailView({ isOpen, onClose, listing }: DetailViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const isEndingSoon = parseInt(listing.timeLeft) <= 15;
  const hasNoDescription = listing.description.trim() === '';

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    )
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <div className="relative h-64 bg-gray-100">
          <Image
            src={listing.images[currentImageIndex] || "/placeholder.svg"}
            alt={listing.name}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {listing.images.length > 1 && (
            <>
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {listing.images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-semibold">{listing.name}</h2>
            {isEndingSoon && (
              <Badge variant="destructive" className="text-sm">
                Ending Soon
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mb-4">{listing.description || "No description provided."}</p>
          {hasNoDescription && (
            <div className="flex items-center text-yellow-600 text-sm mb-4">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span>This description is AI-generated.</span>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{listing.location}</span>
              <span className="text-sm text-gray-500 ml-2">({listing.distance})</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <div>
                <div>{listing.timeLeft} left</div>
                <div className="text-sm text-gray-500">Available until {listing.availableUntil}</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {listing.tags.map((tag) => (
              <Badge 
                key={tag}
                variant="secondary"
                className={cn(
                  "text-sm font-medium",
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
      </DialogContent>
    </Dialog>
  )
}

