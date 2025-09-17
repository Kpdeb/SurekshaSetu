"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import dynamic from "next/dynamic"

const DynamicMap = dynamic(() => import("./interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-green-50 dark:from-blue-950 dark:via-blue-900 dark:to-green-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  status: "safe" | "distress"
  lastUpdate: string
}

export function MapView() {
  const [locations, setLocations] = useState<MapLocation[]>([
    {
      id: "1",
      name: "John Doe",
      lat: 26.1445,
      lng: 91.7362,
      status: "safe",
      lastUpdate: "2 min ago",
    },
    {
      id: "2",
      name: "Jane Smith",
      lat: 25.5788,
      lng: 91.8933,
      status: "safe",
      lastUpdate: "5 min ago",
    },
    {
      id: "3",
      name: "Mike Johnson",
      lat: 24.6637,
      lng: 93.9063,
      status: "distress",
      lastUpdate: "15 min ago",
    },
    {
      id: "4",
      name: "Sarah Wilson",
      lat: 27.0844,
      lng: 88.2663,
      status: "safe",
      lastUpdate: "8 min ago",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setLocations((prev) =>
        prev.map((location) => {
          // Occasionally change status for demo
          const shouldChangeStatus = Math.random() < 0.1
          const newStatus = shouldChangeStatus ? (location.status === "safe" ? "distress" : "safe") : location.status

          return {
            ...location,
            lat: location.lat + (Math.random() - 0.5) * 0.001,
            lng: location.lng + (Math.random() - 0.5) * 0.001,
            status: newStatus,
            lastUpdate: `${Math.floor(Math.random() * 20) + 1} min ago`,
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-full h-full shadow-lg border-0 bg-card overflow-hidden">
      <CardContent className="p-0 relative h-full">
        <DynamicMap locations={locations} />

        {/* Live update indicator */}
        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg z-[1000]">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          LIVE
        </div>

        {/* Status legend */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border z-[1000]">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Live Status</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Safe</span>
              </div>
              <span className="text-xs font-mono text-gray-900 dark:text-gray-100">
                {locations.filter((l) => l.status === "safe").length}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-700 dark:text-gray-300">Distress</span>
              </div>
              <span className="text-xs font-mono text-gray-900 dark:text-gray-100">
                {locations.filter((l) => l.status === "distress").length}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
