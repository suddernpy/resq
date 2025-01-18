'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ChevronLeft, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    name: string;
    description?: string;
    location: string;
    clear_by?: string | null; // Matches `Listing` type in MapPage
    image_url?: string;
    is_cleared?: boolean;
    image_description?: string;
    timeLeft?: string;
    tags?: string[];
  };
}

export function DetailView({ isOpen, onClose, listing }: DetailViewProps) {
  const isEndingSoon =
    listing.clear_by &&
    Math.round((new Date(listing.clear_by).getTime() - new Date().getTime()) / (1000 * 60)) <= 15;

  const hasNoDescription = !listing.description || listing.description.trim() === '';

  const timeLeft = listing.clear_by
    ? `${Math.round(
      (new Date(listing.clear_by).getTime() - new Date().getTime()) / (1000 * 60)
    )} mins left`
    : 'Unknown';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {/* Image Section */}
        <div className="relative h-64 bg-gray-100">
          <Image
            src={listing.image_url || '/placeholder.svg'}
            alt={listing.name || 'Listing'}
            fill
            className="object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-semibold">{listing.description}</h2>
            {isEndingSoon && (
              <Badge variant="destructive" className="text-sm">
                Ending Soon
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4">
            {listing.name}
          </p>
          {hasNoDescription && (
            <div className="flex items-center text-yellow-600 text-sm mb-4">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span>This description is AI-generated.</span>
            </div>
          )}

          {/* Details */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <div>
                <div>{timeLeft}</div>
                {listing.clear_by && (
                  <div className="text-sm text-gray-500">
                    Available until {new Date(listing.clear_by).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {listing.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn(
                    'text-sm font-medium',
                    tag.toLowerCase() === 'veg' && 'bg-green-100 text-green-800 hover:bg-green-200',
                    tag.toLowerCase() === 'halal' && 'bg-blue-100 text-blue-800 hover:bg-blue-200',
                    tag.toLowerCase() === 'beef' && 'bg-red-100 text-red-800 hover:bg-red-200',
                    tag.toLowerCase() === 'pork' && 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}