'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, MapPin, Star } from 'lucide-react'
import { ListingCard } from '@/components/listing-card'

const nusLocations: string[] = [
  'Arts', 'Business', 'Computing', 'Design and Environment', 'Engineering',
  'Law', 'Medicine', 'Science', 'University Town', 'Yusof Ishak House'
]

const allRescues = [
  {
    id: '1',
    name: 'Beehoon',
    description: 'Fresh vegetarian beehoon with various sides',
    location: 'Arts',
    distance: '250m',
    timeLeft: '45 mins',
    tags: ['Veg', 'Halal'],
    images: ['/placeholder.svg', '/placeholder.svg'],
    availableUntil: '5:00 PM'
  },
  {
    id: '2',
    name: 'Noodles',
    description: 'Beef noodles with soup',
    location: 'University Town',
    distance: '1.2km',
    timeLeft: '30 mins',
    tags: ['Beef'],
    images: ['/placeholder.svg'],
    availableUntil: '4:45 PM'
  },
  {
    id: '3',
    name: 'Rice and Veggie',
    description: 'Mixed vegetables with rice',
    location: 'Science',
    distance: '800m',
    timeLeft: '15 mins',
    tags: ['Veg'],
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    availableUntil: '4:30 PM'
  },
  {
    id: '4',
    name: 'Pasta',
    description: 'Creamy mushroom pasta',
    location: 'Business',
    distance: '1.5km',
    timeLeft: '60 mins',
    tags: ['Veg'],
    images: ['/placeholder.svg'],
    availableUntil: '6:00 PM'
  },
]

export default function FavoriteLocationsPage() {
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([])
  const [nearbyRescues, setNearbyRescues] = useState([])

  const isFirstRun = useRef(true)

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      const savedLocations = Cookies.get('favoriteLocations')
      if (savedLocations) {
        try {
          setFavoriteLocations(JSON.parse(savedLocations))
        } catch (error) {
          console.error('Failed to parse cookies:', error)
        }
      }
    }
  }, [])

  useEffect(() => {
    const nearby = allRescues.filter(rescue =>
      favoriteLocations.includes(rescue.location)
    )
    setNearbyRescues(nearby)

    Cookies.set('favoriteLocations', JSON.stringify(favoriteLocations), { expires: 7 })
  }, [favoriteLocations])

  const toggleLocation = (location: string) => {
    setFavoriteLocations(prev =>
      prev.includes(location)
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0f4ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-[#1751d6] hover:text-[#1243a5] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Back to Home</span>
        </Link>
        <h1 className="text-3xl font-bold text-[#1751d6] mb-8">Favorite Locations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-[#1751d6] mb-4">Select Your Favorite Locations</h2>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-1 gap-4">
                  {nusLocations.map(location => (
                    <div key={location} className="flex items-center space-x-3">
                      <Checkbox
                        id={location}
                        checked={favoriteLocations.includes(location)}
                        onCheckedChange={() => toggleLocation(location)}
                        className="w-5 h-5 border-2 border-[#1751d6] text-[#1751d6] rounded-sm focus:ring-[#1751d6] focus:ring-offset-2 checked:bg-[#1751d6] checked:text-white transition-colors"
                      />
                      <label htmlFor={location} className="text-sm font-medium leading-none text-black cursor-pointer">
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <div>
            <h2 className="text-xl font-semibold text-[#1751d6] mb-4">Nearby Rescues</h2>
            {nearbyRescues.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {nearbyRescues.map(rescue => (
                    <ListingCard key={rescue.id} listing={rescue} onClick={() => {}} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-black mb-4">No nearby rescues found. Select your favorite locations to see available rescues.</p>
                  <Star className="w-12 h-12 text-[#1751d6] opacity-60 mx-auto" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

