"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { FoundItem } from "@/types/item"
import { Calendar, MapPin, User } from "lucide-react"
import Image from "next/image"

interface ItemCardProps {
  item: FoundItem
  onContact: (item: FoundItem) => void
}

export function ItemCard({ item, onContact }: ItemCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "claimed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "returned":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col">
      {item.imageUrl && (
        <div className="relative w-full h-48 border-b">
          <Image
            src={item.imageUrl}
            alt={`Image of ${item.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded-t-xl"
            priority={true} // Load first few images faster
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="secondary" className="mr-2">
                {item.category}
              </Badge>
              <Badge className={getStatusColor(item.status)}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>

          <div className="space-y-2 text-sm mt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Found at: {item.location}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Date found: {formatDate(item.dateFound)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Posted by: {item.postedByName}</span>
            </div>
          </div>
        </div>

        {item.status === "available" && (
          <Button onClick={() => onContact(item)} className="w-full mt-4" size="sm">
            Contact Finder
          </Button>
        )}
      </CardContent>
    </Card>
  )
}