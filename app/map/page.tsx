'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Search, Bell, List, Utensils, Clock, MapPin } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ListingCard } from '@/components/listing-card'
import { DetailView } from '@/components/detail-view'
import { Badge } from "@/components/ui/badge"

const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VkZGVybnB5IiwiYSI6ImNtNjF1cXRyZjBucWMycHB5MXQ3cGl6MHcifQ.7A1XDPcsmGeE981d2m7LTg'

const rescueLocations: Location[] = [
    { 
    id: '1', 
    name: 'Beehoon', 
    location: 'S16',
    tags: ['Veg', 'Halal'],
    description: 'Fresh vegetarian beehoon with various sides',
    timeLeft: '45 mins',
    distance: '250m',
    lat: 1.2978,
    lng: 103.7807,
    image: '/images/beehoon.jpg',
    images: ['/images/beehoon.jpg', '/images/beehoon-2.jpg'],
    availableUntil: '5:00 PM'
  },
  { 
    id: '2', 
    name: 'Noodles', 
    location: 'Utown',
    tags: ['Beef'],
    description: '',
    timeLeft: '30 mins',
    distance: '1.2km',
    lat: 1.3039,
    lng: 103.7739,
    image: '/images/noodles.jpg',
    images: ['/images/noodles.jpg'],
    availableUntil: '4:45 PM'
  },
  { 
    id: '3', 
    name: 'Rice and Veggie', 
    location: 'Com1',
    tags: ['Veg'],
    description: 'Mixed vegetables with rice',
    timeLeft: '15 mins',
    distance: '800m',
    lat: 1.2958,
    lng: 103.7735,
    image: '/images/rice-veggie.jpg',
    images: ['/images/rice-veggie.jpg', '/images/rice-veggie-2.jpg', '/images/rice-veggie-3.jpg'],
    availableUntil: '4:30 PM'
  },
]

type Location = {
    id: string;
    name: string;
    location: string;
    tags: string[];
    description: string;
    timeLeft: string;
    distance: string;
    lat: number;
    lng: number;
    image: string;
    images: string[];
    availableUntil: string;
  };

  interface Rescue {
    id: string
    name: string
    description: string
    location: string
    distance: string
    timeLeft: string
    tags: string[]
    image: string
  }
  

const CustomMarker: React.FC<{ location: Location; onClick: () => void }> = ({ location, onClick }) => (
    <div onClick={onClick} className="group relative cursor-pointer">
    <div className="bg-[#1751d6] rounded-full p-3 shadow-md hover:shadow-lg transition-shadow duration-300">
      <Utensils className="text-[#ffffff] w-5 h-5" />
    </div>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <h4 className="font-semibold text-sm mb-1">{location.name}</h4>
      <div className="flex items-center text-xs text-gray-600 mb-1">
        <MapPin className="w-3 h-3 mr-1" />
        <span>{location.location}</span>
      </div>
      <div className="flex items-center text-xs text-gray-600">
        <Clock className="w-3 h-3 mr-1" />
        <span>{location.timeLeft} left</span>
      </div>
    </div>
  </div>
)

export default function MapPage() {
  const [showListView, setShowListView] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Location | null>(null);

  const sortedRescueLocations = useMemo(() => {
    return [...rescueLocations].sort((a, b) => {
      // Sort by distance first
      const distanceA = parseInt(a.distance);
      const distanceB = parseInt(b.distance);
      if (distanceA !== distanceB) {
        return distanceA - distanceB;
      }
      // If distances are equal, sort by time left
      const timeLeftA = parseInt(a.timeLeft);
      const timeLeftB = parseInt(b.timeLeft);
      return timeLeftA - timeLeftB;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="fixed top-0 left-0 right-0 z-10 bg-white/95 border-b border-gray-200 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#1D4ED8] font-semibold text-xl hover:opacity-80 transition-opacity">
            ResQ+
          </Link>
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <Link href="/" className="text-gray-600 hover:text-[#1D4ED8] transition-colors">
                Home
              </Link>
              <Link href="/map" className="text-[#1D4ED8] hover:opacity-80 transition-opacity">
                Map
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-gray-600 hover:text-[#1D4ED8] transition-colors p-2 rounded-full hover:bg-blue-50">
                      <Search className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Search rescues</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-gray-600 hover:text-[#1D4ED8] transition-colors p-2 rounded-full hover:bg-blue-50">
                      <Bell className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="h-[calc(100vh-4rem)] relative">
          {!showListView ? (
            <>
              <Map
                initialViewState={{
                  longitude: 103.7764,
                  latitude: 1.2966,
                  zoom: 15,
                }}
                style={{ height: '100%', width: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
              >
                {sortedRescueLocations.map((location) => (
                  <Marker key={location.id} longitude={location.lng} latitude={location.lat}>
                    <CustomMarker 
                      location={location} 
                      onClick={() => setSelectedListing(location)}
                    />
                  </Marker>
                ))}
              </Map>

              {/* Overlayed List View Button */}
              <div className="absolute top-4 left-4 z-10 flex items-center">
                <button
                  onClick={() => setShowListView(true)}
                  className="flex items-center bg-white text-[#1D4ED8] px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <List className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">List View</span>
                </button>
              </div>
            </>
          ) : (
            <div className="max-w-[1200px] mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-[#1751d6 font-bold">Available Rescues</h2>
                <button
                  onClick={() => setShowListView(false)}
                  className="flex items-center bg-white text-[#1D4ED8] px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Map View</span>
                </button>
              </div>
              <div className="grid gap-4">
                {sortedRescueLocations.map((rescue) => (
                  <ListingCard
                    key={rescue.id}
                    listing={rescue}
                    onClick={() => setSelectedListing(rescue)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedListing && (
        <DetailView
          isOpen={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          listing={selectedListing}
        />
      )}
    </div>
  )
}

