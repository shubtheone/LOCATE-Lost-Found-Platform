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

interface MyItemsProps {
  onBack: () => void
}

export function MyItems({ onBack }: MyItemsProps) {
  const [myItems, setMyItems] = useState<FoundItem[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      const allItems = JSON.parse(localStorage.getItem("lf_items") || "[]")
      const userItems = allItems.filter((item: FoundItem) => item.postedBy === user.id)
      setMyItems(userItems)
    }
  }, [user])

  const updateItemStatus = (itemId: string, newStatus: "available" | "claimed" | "returned") => {
    const allItems = JSON.parse(localStorage.getItem("lf_items") || "[]")
    const updatedItems = allItems.map((item: FoundItem) => (item.id === itemId ? { ...item, status: newStatus } : item))

    localStorage.setItem("lf_items", JSON.stringify(updatedItems))
    setMyItems(updatedItems.filter((item: FoundItem) => item.postedBy === user?.id))

    toast({
      title: "Status Updated",
      description: `Item status changed to ${newStatus}`,
    })
  }

  const deleteItem = (itemId: string) => {
    const allItems = JSON.parse(localStorage.getItem("lf_items") || "[]")
    const updatedItems = allItems.filter((item: FoundItem) => item.id !== itemId)

    localStorage.setItem("lf_items", JSON.stringify(updatedItems))
    setMyItems(updatedItems.filter((item: FoundItem) => item.postedBy === user?.id))

    toast({
      title: "Item Deleted",
      description: "The item has been removed from your listings",
    })
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
          <Button onClick={onBack}>Post Your First Item</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
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
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Found at: {item.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Date found: {formatDate(item.dateFound)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Update Status:</label>
                    <Select value={item.status} onValueChange={(value) => updateItemStatus(item.id, value as any)}>
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

      {myItems.length > 0 && (
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="font-medium mb-2">Item Status Guide</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Available</Badge>
              <span className="text-muted-foreground">Item is still available for pickup</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Claimed</Badge>
              <span className="text-muted-foreground">Someone has claimed the item</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Returned</Badge>
              <span className="text-muted-foreground">Item has been returned to owner</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
