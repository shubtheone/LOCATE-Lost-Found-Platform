"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Calendar, Edit2, Save, X } from "lucide-react"

interface UserProfileProps {
  onBack: () => void
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")

  if (!user) return null

  const handleSave = () => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      })
      return
    }

    // Update user in localStorage
    const updatedUser = { ...user, name: editedName }
    localStorage.setItem("lf_user", JSON.stringify(updatedUser))

    // Update user in users list
    const users = JSON.parse(localStorage.getItem("lf_users") || "[]")
    const updatedUsers = users.map((u: any) => (u.id === user.id ? { ...u, name: editedName } : u))
    localStorage.setItem("lf_users", JSON.stringify(updatedUsers))

    // Update items posted by this user
    const items = JSON.parse(localStorage.getItem("lf_items") || "[]")
    const updatedItems = items.map((item: any) =>
      item.postedBy === user.id ? { ...item, postedByName: editedName } : item,
    )
    localStorage.setItem("lf_items", JSON.stringify(updatedItems))

    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    })

    // Refresh the page to update the context
    window.location.reload()
  }

  const handleCancel = () => {
    setEditedName(user.name)
    setIsEditing(false)
  }

  const getJoinDate = () => {
    // Since we don't store join date, we'll use a placeholder
    return "Member since registration"
  }

  const getItemStats = () => {
    const items = JSON.parse(localStorage.getItem("lf_items") || "[]")
    const userItems = items.filter((item: any) => item.postedBy === user.id)
    const availableItems = userItems.filter((item: any) => item.status === "available").length
    const returnedItems = userItems.filter((item: any) => item.status === "returned").length

    return {
      total: userItems.length,
      available: availableItems,
      returned: returnedItems,
    }
  }

  const stats = getItemStats()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <User className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Your account details and statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={user.name} disabled />
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input value={user.email} disabled />
              </div>
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label>Member Since</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{getJoinDate()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Statistics</CardTitle>
          <CardDescription>Your contribution to the Lost & Found community</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Items Posted</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.returned}</div>
              <div className="text-sm text-muted-foreground">Returned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
