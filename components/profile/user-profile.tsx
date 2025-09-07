"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Edit2, Save, X, Loader2, ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface UserProfileProps {
  onBack: () => void
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { toast } = useToast()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(user?.name || "")
  const [isSaving, setIsSaving] = useState(false)
  const [stats, setStats] = useState({ total: 0, available: 0, returned: 0 })
  const [isStatsLoading, setIsStatsLoading] = useState(true)

  // Fetch user-specific item stats from the API
  useEffect(() => {
    const getItemStats = async () => {
      if (!user) return;
      setIsStatsLoading(true);
      try {
        const response = await fetch('/api/items');
        if (!response.ok) throw new Error("Failed to fetch items for stats");
        
        const { items } = await response.json();
        const userItems = items.filter((item: any) => item.postedBy === user.id);
        const returnedItems = userItems.filter((item: any) => item.status === "returned").length;
        
        setStats({
          total: userItems.length,
          available: userItems.filter((item: any) => item.status === "available").length,
          returned: returnedItems,
        });
      } catch (error) {
        console.error("Failed to get item stats:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    getItemStats();
  }, [user]);

  // Set the initial editable name when user data loads
  useEffect(() => {
    if (user) {
        setEditedName(user.name);
    }
  }, [user]);

  if (isAuthLoading || !user) {
    // You can replace this with a more detailed skeleton if you prefer
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
        </div>
    );
  }

  const handleSave = async () => {
    if (!editedName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      })
      return
    }

    if (editedName.trim() === user.name) {
        setIsEditing(false);
        return;
    }

    setIsSaving(true);
    const token = localStorage.getItem("lf_token");

    try {
        const response = await fetch(`/api/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: editedName.trim() })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to update profile");
        }

        setIsEditing(false)
        toast({
          title: "Profile Updated",
          description: "Your name has been updated successfully.",
        })
        
        // Reload the page to make the new name appear in the header
        window.location.reload();

    } catch (error: any) {
        toast({
            title: "Update Failed",
            description: error.message || "An error occurred. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsSaving(false);
    }
  }

  const handleCancel = () => {
    setEditedName(user.name)
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">User Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account information and activity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Your personal account details</CardDescription>
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
                    disabled={isSaving}
                  />
                  <Button size="icon" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span className="sr-only">Save</span>
                  </Button>
                  <Button size="icon" variant="outline" onClick={handleCancel} disabled={isSaving}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Cancel</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input value={user.name} disabled />
                  <Button size="icon" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit Name</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={user.email} disabled className="pl-10" />
              </div>
              <p className="text-sm text-muted-foreground">Email cannot be changed.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Statistics</CardTitle>
          <CardDescription>Your contribution to the community</CardDescription>
        </CardHeader>
        <CardContent>
          {isStatsLoading ? (
            <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-[76px] w-full rounded-lg" />
                <Skeleton className="h-[76px] w-full rounded-lg" />
                <Skeleton className="h-[76px] w-full rounded-lg" />
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}