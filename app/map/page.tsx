"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Search, Bell, List, Utensils, Clock, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ListingCard } from "@/components/listing-card";
import { DetailView } from "@/components/detail-view";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

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
  dietary_restrictions: string;
};

const CustomMarker: React.FC<{ location: Listing; onClick: () => void }> = ({
  location,
  onClick,
}) => (
  <div onClick={onClick} className="group relative cursor-pointer">
    <div className="bg-[#1751d6] rounded-full p-3 shadow-md hover:shadow-lg transition-shadow duration-300">
      <Utensils className="text-[#ffffff] w-5 h-5" />
    </div>
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white p-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <h4 className="font-semibold text-sm mb-1">{location.raw_message}</h4>
      <div className="flex items-center text-xs text-gray-600 mb-1">
        <MapPin className="w-3 h-3 mr-1" />
        <span>{location.roomCode}</span>
      </div>
      {location.clear_by && (
        <div className="flex items-center text-xs text-gray-600">
          <Clock className="w-3 h-3 mr-1" />
          <span>
            {Math.round(
              (new Date(location.clear_by).getTime() - new Date().getTime()) /
                (1000 * 60)
            )}{" "}
            mins left
          </span>
        </div>
      )}
    </div>
  </div>
);

export default function MapPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [showListView, setShowListView] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setListings(data as Listing[]);
      }
    };

    fetchMessages();
  }, []);

  // Listen for new messages
  useEffect(() => {
    const handleInserts = (payload: { new: Listing }) => {
      console.log("New listing received:", payload.new);
      setListings((prevListings) => [...prevListings, payload.new]);
    };

    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        handleInserts
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const sortedListings = useMemo(() => {
    return listings.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [listings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="fixed top-0 left-0 right-0 z-10 bg-white/95 border-b border-gray-200 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-[#1D4ED8] font-semibold text-xl hover:opacity-80 transition-opacity"
          >
            ResQ+
          </Link>
          <nav className="flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-[#1D4ED8] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/map"
              className="text-[#1D4ED8] hover:opacity-80 transition-opacity"
            >
              Map
            </Link>
          </nav>
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
                style={{ height: "100%", width: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
              >
                {sortedListings.map((listing) => (
                  <Marker
                    key={listing.id}
                    longitude={listing.longitude}
                    latitude={listing.latitude}
                  >
                    <CustomMarker
                      location={listing}
                      onClick={() => setSelectedListing(listing)}
                    />
                  </Marker>
                ))}
              </Map>

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
                <h2 className="text-2xl font-bold text-[#1751d6]">
                  Available Rescues
                </h2>
                <button
                  onClick={() => setShowListView(false)}
                  className="flex items-center bg-white text-[#1D4ED8] px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Map View</span>
                </button>
              </div>
              <div className="grid gap-4">
              {sortedListings.map((listing) => {
  // Calculate time left
  const timeLeft =
    listing.clear_by && new Date(listing.clear_by).getTime() > Date.now()
      ? `${Math.round(
          (new Date(listing.clear_by).getTime() - Date.now()) / (1000 * 60)
        )} mins`
      : "Expired";

  return (
    <ListingCard
      key={listing.id}
      listing={{
        id: listing.id.toString(),
        name: listing.raw_message,
        description: listing.image_description,
        location: listing.roomCode,
        timeLeft, // Use calculated time left
        image: listing.image_url,
        tags: listing.dietary_restrictions
          ? listing.dietary_restrictions.split(",").map(tag => tag.trim())
          : [],
      }}
      onClick={() => setSelectedListing(listing)}
    />
  );
})}

              </div>
            </div>
          )}
        </div>
      </main>

      {selectedListing && (
        <DetailView
          isOpen={!!selectedListing}
          onClose={() => setSelectedListing(null)}
          listing={{
            id: selectedListing?.id.toString() || "",
            name: selectedListing?.raw_message || "Unnamed Listing",
            description: selectedListing?.image_description || "",
            location: selectedListing?.roomCode || "Unknown Location",
            clear_by: selectedListing?.clear_by,
            image_url: selectedListing?.image_url,
            tags: selectedListing.dietary_restrictions
        ? selectedListing.dietary_restrictions.split(",").map(tag => tag.trim())
        : [],
          }}
        />
      )}
    </div>
  );
}
