"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { FoundItem } from "@/types/item"
import { Phone, Mail, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ContactModalProps {
  item: FoundItem | null
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ item, isOpen, onClose }: ContactModalProps) {
  const { toast } = useToast()

  if (!item) return null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Contact information copied to clipboard",
    })
  }

  const isEmail = (contact: string) => contact.includes("@")
  const isPhone = (contact: string) => /^\+?[\d\s\-$$$$]+$/.test(contact)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
          <DialogDescription>Get in touch with the person who found "{item.title}"</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Item Details</h4>
            <p className="text-sm text-muted-foreground mb-1">
              <strong>Found at:</strong> {item.location}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Date:</strong> {new Date(item.dateFound).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Contact the Finder</h4>
            <div className="flex items-center gap-2 p-3 bg-background border rounded-lg">
              {isEmail(item.contactInfo) ? (
                <Mail className="h-4 w-4 text-muted-foreground" />
              ) : isPhone(item.contactInfo) ? (
                <Phone className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Phone className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="flex-1 font-mono text-sm">{item.contactInfo}</span>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.contactInfo)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            {isEmail(item.contactInfo) && (
              <Button
                className="flex-1"
                onClick={() => window.open(`mailto:${item.contactInfo}?subject=Found Item: ${item.title}`)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
            )}
            {isPhone(item.contactInfo) && (
              <Button className="flex-1" onClick={() => window.open(`tel:${item.contactInfo}`)}>
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
