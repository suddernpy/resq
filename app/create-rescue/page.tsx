'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowLeft, Upload, Info } from 'lucide-react'
import venuesData from '../../venues.json'; // Adjust the relative path based on your file location
import { supabase } from "@/lib/supabaseClient";

const foodRestrictions = ['Halal', 'Beef', 'Vegetarian', 'Pork']

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

interface FormData {
  image: File | null;
  name: string;
  description: string;
  location: string;
  availableUntil: string;
  foodRestrictions: string[];
}


interface Venue {
  roomCode: string;
  coordinate: {
    longitude: number;
    latitude: number;
  };
}

export default function CreateRescuePage() {
  const router = useRouter()
  const [venues, setVenues] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    image: null,
    name: '',
    description: '',
    location: '',
    availableUntil: '',
    foodRestrictions: [],
  })

  useEffect(() => {
    // Directly use the imported JSON data
    const roomCodes = venuesData.map((venue: Venue) => venue.roomCode);
    setVenues(roomCodes);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const uploadImage = async (image: File) => {
    const fileName = `${Date.now()}_${image.name}`;
    const { data, error } = await supabase.storage
      .from('images') // Replace 'images' with your Supabase storage bucket name
      .upload(fileName, image);
  
    if (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
    return `${supabaseUrl}/storage/v1/object/public/images/${data.path}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const venue = venuesData.find((v: Venue) => v.roomCode === formData.location);
      if (!venue) throw new Error('Invalid location selected');

      let imageUrl = '';
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const rawMessage = `${formData.name}: ${formData.description}`;
      const { data, error } = await supabase.from('messages').insert({
        raw_message: rawMessage,
        roomCode: venue.roomCode,
        longitude: venue.coordinate.longitude,
        latitude: venue.coordinate.latitude,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        is_cleared: false,
        is_sent_from_telegram: false,
        image_description: 'none',
        clear_by: null,
      });

      if (error) {
        console.error('Error inserting data:', data, error);
        throw error;
      }

      console.log('Listing created:', data);
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <Card className="bg-white shadow-md">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Create New Rescue Listing</h1>
            <p className="text-gray-600 mb-6">Fill in the details to create a new food rescue listing</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label htmlFor="image" className="text-gray-700 mb-2 block">Image of Food</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {formData.image ? (
                        <img src={formData.image} alt="Uploaded food" className="mx-auto h-32 w-32 object-cover rounded-md" />
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600 items-center justify-center h-5">
                        <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>{formData.image ? 'Change image' : 'Upload an image'}</span>
                          <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-gray-700 mb-2 block">Name of Food Items</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="e.g., Vegetarian Fried Rice"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-gray-700 mb-2 block">Description of Food</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                    placeholder="Describe the food items, quantity, and any other relevant details"
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="text-gray-700 mb-2 block">Location</Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleSelectChange('location', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {venues.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Available Until */}
                  <div>
                    <Label htmlFor="availableUntil" className="text-gray-700 mb-2 block">
                      Available Until
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 inline-block ml-2 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Specify the latest time the food will be available for pickup</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="availableUntil"
                      name="availableUntil"
                      type="time"
                      value={formData.availableUntil}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Food Restrictions */}
                <div>
                  <Label htmlFor="foodRestrictions" className="text-gray-700 mb-2 block">Food Restrictions</Label>
                  <Select
                    value={formData.foodRestrictions.join(',')}
                    onValueChange={(value) => handleSelectChange('foodRestrictions', value.split(','))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select food restrictions" />
                    </SelectTrigger>
                    <SelectContent>
                      {foodRestrictions.map((restriction) => (
                        <SelectItem key={restriction} value={restriction}>{restriction}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Create Rescue Listing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
