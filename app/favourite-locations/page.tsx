'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Star } from 'lucide-react';
import { ListingCard } from '@/components/listing-card';
import venues from '@/venues.json';

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Adjusted Venue type
type Venue = {
  id: string;
  name: string;
  roomCode?: string;
  coordinate?: {
    longitude: number;
    latitude: number;
    z?: number;
  };
  aliases?: string[];
};

type Listing = {
  id: number;
  raw_message: string;
  roomCode: string;
  longitude: number;
  latitude: number;
  image_url: string;
  created_at: string;
  is_cleared: boolean;
  image_description: string;
  is_sent_from_telegram: boolean;
  clear_by: string | null;
  dietary_restrictions: string[];
};

export default function FavoriteLocationsPage() {
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([]);
  const [nearbyListings, setNearbyListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const isFirstRun = useRef(true);

  const venuesData: Venue[] = venues.map((venue, index) => ({
    id: venue.roomCode || `venue-${index}`,
    name: venue.roomCode || '',
    roomCode: venue.roomCode,
    coordinate: venue.coordinate,
    aliases: venue.aliases,
  }));

  // Fetch messages from Supabase
  const fetchListings = async () => {
    const { data, error } = await supabase.from('messages').select('*');
    if (error) {
      console.error('Error fetching Listings:', error);
      return;
    }
    setAllListings(data as Listing[]);
  };

  useEffect(() => {
    fetchListings(); // Fetch messages on component mount

    if (isFirstRun.current) {
      isFirstRun.current = false;
      const savedLocations = Cookies.get('favoriteLocations');
      if (savedLocations) {
        try {
          setFavoriteLocations(JSON.parse(savedLocations));
        } catch (error) {
          console.error('Failed to parse cookies:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const nearby = allListings.filter((listing) =>
      favoriteLocations.includes(listing.roomCode)
    );
    setNearbyListings(nearby);

    Cookies.set('favoriteLocations', JSON.stringify(favoriteLocations), { expires: 7 });
  }, [favoriteLocations, allListings]);

  const toggleLocation = (location: string) => {
    setFavoriteLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#f0f4ff]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-[#1751d6] hover:text-[#1243a5] mb-6 transition-colors"
        >
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
                  {venuesData.map((venue) => (
                    <div key={venue.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={venue.id}
                        checked={favoriteLocations.includes(venue.name)}
                        onCheckedChange={() => toggleLocation(venue.name)}
                        className="w-5 h-5 border-2 border-[#1751d6] text-[#1751d6] rounded-sm focus:ring-[#1751d6] focus:ring-offset-2 checked:bg-[#1751d6] checked:text-white transition-colors"
                      />
                      <label
                        htmlFor={venue.id}
                        className="text-sm font-medium leading-none text-black cursor-pointer"
                      >
                        {venue.name}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          <div>
            <h2 className="text-xl font-semibold text-[#1751d6] mb-4">Nearby Listings</h2>
            {nearbyListings.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {nearbyListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={{
                        id: listing.id.toString(),
                        name: listing.raw_message,
                        description: listing.image_description,
                        location: listing.roomCode,
                        distance: `${listing.longitude}, ${listing.latitude}`,
                        timeLeft: listing.clear_by
                          ? `${Math.round(
                              (new Date(listing.clear_by).getTime() - new Date().getTime()) /
                                (1000 * 60)
                            )} mins`
                          : 'Unknown',
                        tags: listing.dietary_restrictions,
                        image: listing.image_url,
                      }}
                      onClick={() => {}}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-black mb-4">
                    No nearby listings found. Select your favorite locations to see
                    available listings.
                  </p>
                  <Star className="w-12 h-12 text-[#1751d6] opacity-60 mx-auto" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
