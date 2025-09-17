"use client"

import { useEffect, useRef } from "react"

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  status: "safe" | "distress"
  lastUpdate: string
}

interface InteractiveMapProps {
  locations: MapLocation[]
}

export default function InteractiveMap({ locations }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return

    const loadLeafletFromCDN = () => {
      // Check if Leaflet is already loaded
      if ((window as any).L) {
        initializeMap()
        return
      }

      // Load Leaflet CSS
      const cssLink = document.createElement("link")
      cssLink.rel = "stylesheet"
      cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      cssLink.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      cssLink.crossOrigin = "anonymous"
      document.head.appendChild(cssLink)

      // Load Leaflet JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      script.crossOrigin = "anonymous"
      script.onload = () => {
        initializeMap()
      }
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      const L = (window as any).L
      if (!L || mapInstanceRef.current) return

      mapInstanceRef.current = L.map(mapRef.current).setView([26.1445, 91.7362], 7)

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(mapInstanceRef.current)

      // Add initial markers
      updateMarkers()
    }

    const updateMarkers = () => {
      const L = (window as any).L
      if (!L || !mapInstanceRef.current) return

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      markersRef.current = []

      locations.forEach((location) => {
        // Create custom icon HTML
        const iconHtml = `
          <div style="
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: ${location.status === "safe" ? "#10b981" : "#ef4444"};
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: -5px;
              left: -5px;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background-color: ${location.status === "safe" ? "#10b981" : "#ef4444"};
              opacity: 0.3;
              animation: leaflet-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          </div>
        `

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-leaflet-marker",
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })

        const marker = L.marker([location.lat, location.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 150px;">
              <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">${location.name}</div>
              <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Last seen: ${location.lastUpdate}</div>
              <div style="
                font-size: 11px; 
                font-weight: 500; 
                color: ${location.status === "safe" ? "#059669" : "#dc2626"};
                text-transform: uppercase;
                padding: 2px 6px;
                border-radius: 4px;
                background-color: ${location.status === "safe" ? "#dcfce7" : "#fee2e2"};
                display: inline-block;
              ">
                ${location.status}
              </div>
            </div>
          `)

        markersRef.current.push(marker)
      })
    }

    loadLeafletFromCDN()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update markers when locations change
  useEffect(() => {
    if (mapInstanceRef.current && (window as any).L) {
      const updateMarkers = () => {
        const L = (window as any).L

        // Clear existing markers
        markersRef.current.forEach((marker) => {
          mapInstanceRef.current.removeLayer(marker)
        })
        markersRef.current = []

        // Add updated markers
        locations.forEach((location) => {
          const iconHtml = `
            <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: ${location.status === "safe" ? "#10b981" : "#ef4444"};
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              position: relative;
            ">
              <div style="
                position: absolute;
                top: -5px;
                left: -5px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: ${location.status === "safe" ? "#10b981" : "#ef4444"};
                opacity: 0.3;
                animation: leaflet-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
            </div>
          `

          const customIcon = L.divIcon({
            html: iconHtml,
            className: "custom-leaflet-marker",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })

          const marker = L.marker([location.lat, location.lng], { icon: customIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="font-family: system-ui, -apple-system, sans-serif; min-width: 150px;">
                <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px;">${location.name}</div>
                <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Last seen: ${location.lastUpdate}</div>
                <div style="
                  font-size: 11px; 
                  font-weight: 500; 
                  color: ${location.status === "safe" ? "#059669" : "#dc2626"};
                  text-transform: uppercase;
                  padding: 2px 6px;
                  border-radius: 4px;
                  background-color: ${location.status === "safe" ? "#dcfce7" : "#fee2e2"};
                  display: inline-block;
                ">
                  ${location.status}
                </div>
              </div>
            `)

          markersRef.current.push(marker)
        })
      }

      updateMarkers()
    }
  }, [locations])

  return (
    <>
      <div ref={mapRef} className="w-full h-full" />
      <style jsx global>{`
        @keyframes leaflet-ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </>
  )
}
