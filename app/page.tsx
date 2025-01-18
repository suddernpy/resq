import Link from "next/link"
import Image from "next/image"
import { Search, Bell, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="fixed top-0 left-0 right-0 bg-white/95 border-b border-gray-200 backdrop-blur-sm shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-[#1751d6] font-semibold text-xl hover:opacity-80 transition-opacity">
            ResQ+
          </Link>
          <div className="flex items-center gap-8">
            <nav className="flex items-center gap-8">
              <Link href="/" className="text-[#1751d6] hover:opacity-80 transition-opacity">
                Home
              </Link>
              <Link href="/map" className="text-gray-600 hover:text-[#1751d6] transition-colors">
                Map
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-[#1751d6] transition-colors p-2 rounded-full hover:bg-blue-50">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-600 hover:text-[#1751d6] transition-colors p-2 rounded-full hover:bg-blue-50">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="max-w-[720px] mx-auto px-6 py-24 text-center">
          <div className="inline-block bg-[#DBEAFE] text-[#1751d6] px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm hover:shadow transition-shadow">
            Welcome to ResQ+
          </div>
          <h1 className="text-[#111827] text-5xl font-bold mb-6 tracking-tight">
            Save Food, Share Joy
          </h1>
          <p className="text-gray-600 text-xl mb-8">
            Join our community in reducing food waste across NUS. Find and share buffet 
            leftovers to ensure no good food goes to waste.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/create-rescue">
              <button className="bg-[#1751d6] text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md hover:bg-blue-700 transition-all">
                Get Started
              </button>
            </Link>
            <Link href="/map">
              <button className="border border-[#1751d6] text-[#1751d6] px-6 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </Link>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 pb-24">
          <div className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-[#DBEAFE] w-10 h-10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-[#1751d6] text-2xl font-medium">+</span>
            </div>
            <h2 className="text-[#111827] text-xl font-semibold mb-2">
              Add Rescue Listing
            </h2>
            <p className="text-gray-600 mb-4">
              Share leftover buffet food with others
            </p>
            <Link 
              href="/create-rescue" 
              className="text-[#1751d6] font-medium inline-flex items-center group-hover:gap-1.5 gap-1 transition-all"
            >
              Create New Listing 
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          <div className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-[#DBEAFE] w-10 h-10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-[#1751d6] text-2xl">📍</span>
            </div>
            <h2 className="text-[#111827] text-xl font-semibold mb-2">
              Favorite Locations
            </h2>
            <p className="text-gray-600 mb-4">
              Customize your preferred spots in NUS
            </p>
            <Link 
              href="/favourite-locations" 
              className="text-[#1751d6] font-medium inline-flex items-center group-hover:gap-1.5 gap-1 transition-all"
            >
              Manage Locations 
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>

          <div className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-[#DBEAFE] w-10 h-10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-[#1751d6] text-2xl">💬</span>
            </div>
            <h2 className="text-[#111827] text-xl font-semibold mb-2">
              Join Our Community
            </h2>
            <p className="text-gray-600 mb-4">
              Get real-time updates on Telegram
            </p>
            <Link 
              href="https://t.me/resqf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#1751d6] font-medium inline-flex items-center group-hover:gap-1.5 gap-1 transition-all"
            >
              Join Telegram Group 
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </section>

          <div className="mx-auto max-w-[1100px] rounded-3xl bg-gradient-to-r from-blue-600 to-blue-400 p-8 md:p-12 shadow-xl">
            <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to reduce food waste?</h2>
                <p className="text-blue-50 text-lg">
                  Join our mission to create a more sustainable campus community. Every meal shared is a step towards a greener future.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row items-center justify-start md:justify-end">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full sm:w-auto group relative overflow-hidden bg-white text-blue-600 hover:text-blue-700 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                
              </div>
            </div>
          </div>
      </main>
    </div>
  )
}
