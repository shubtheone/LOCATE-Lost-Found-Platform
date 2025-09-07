"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { FoundItem } from "@/types/item"
import { ArrowLeft, Calendar, MapPin, Edit, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

interface MyItemsProps {
  onBack: () => void
}

export function MyItems({ onBack }: MyItemsProps) {
  const [myItems, setMyItems] = useState<FoundItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchMyItems = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/items")
      if (!response.ok) {
        throw new Error("Failed to fetch items")
      }
      const data = await response.json()
      const userItems = data.items.filter((item: FoundItem) => item.postedBy === user.id)
      setMyItems(userItems)
    } catch (error) {
      console.error("Failed to fetch user items:", error)
      toast({
        title: "Error",
        description: "Could not load your posted items. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyItems()
    }
  }, [user])

  const updateItemStatus = async (itemId: string, newStatus: "available" | "claimed" | "returned") => {
    const token = localStorage.getItem("lf_token")
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      toast({
        title: "Status Updated",
        description: `Item status has been changed to ${newStatus}.`,
      })
      fetchMyItems()
    } catch (error) {
      console.error("Update item error:", error)
      toast({
        title: "Update Failed",
        description: "Could not update the item status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteItem = async (itemId: string) => {
    const token = localStorage.getItem("lf_token")
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete item")
      }

      toast({
        title: "Item Deleted",
        description: "The item has been successfully removed.",
      })
      fetchMyItems()
    } catch (error) {
      console.error("Delete item error:", error)
      toast({
        title: "Delete Failed",
        description: "Could not delete the item. Please try again.",
        variant: "destructive",
      })
    }
  }

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">My Posted Items</h1>
          <p className="text-muted-foreground mt-2">Loading your items...</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-9 w-full mt-2" />
                <Skeleton className="h-8 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">My Posted Items</h1>
        <p className="text-muted-foreground mt-2">Manage your {myItems.length} posted found items</p>
      </div>

      {myItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No items posted yet</h3>
            <p>Start helping others by posting found items!</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow flex flex-col">
               {item.imageUrl && (
                <div className="relative w-full h-48 border-b">
                  <Image
                    src={item.imageUrl}
                    alt={`Image of ${item.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-xl"
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
                    </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Update Status:</label>
                    <Select
                      value={item.status}
                      onValueChange={(value) => updateItemStatus(item.id, value as any)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="claimed">Claimed</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="flex-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}