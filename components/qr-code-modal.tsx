"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check } from "lucide-react"
import { useState, useEffect } from "react"

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  touristId: string
}

export function QRCodeModal({ isOpen, onClose, touristId }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (touristId) {
      setIsLoading(true)
      setHasError(false)

      const qrData = encodeURIComponent(
        `Tourist ID: ${touristId}\nSafety Portal: https://suraksha-setu.gov.in/verify/${touristId}`,
      )
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&format=png&ecc=M&data=${qrData}`
      setQrCodeUrl(qrUrl)

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setIsLoading(false)
      }
      img.onerror = () => {
        setIsLoading(false)
        setHasError(true)
      }
      img.src = qrUrl
    }
  }, [touristId])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(touristId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadQR = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `tourist-id-${touristId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">Tourist ID Generated Successfully</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="relative">
            {isLoading ? (
              <div className="w-48 h-48 bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : hasError ? (
              <div className="w-48 h-48 bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground mb-2">QR Code Error</p>
                  <p className="text-xs text-muted-foreground">ID: {touristId}</p>
                </div>
              </div>
            ) : (
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt={`QR Code for ${touristId}`}
                className="w-48 h-48 border-2 border-border rounded-lg shadow-sm"
                onError={() => setHasError(true)}
              />
            )}
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Tourist ID: <span className="font-mono font-medium text-foreground">{touristId}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Scan this QR code for quick identification and emergency access
            </p>
          </div>

          <div className="flex gap-2 w-full">
            <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent" disabled={copied}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy ID"}
            </Button>
            <Button
              onClick={downloadQR}
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={!qrCodeUrl || hasError}
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR
            </Button>
          </div>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
