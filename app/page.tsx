"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { ItemRegistrationForm } from "@/components/items/item-registration-form"
import { LostItemsDashboard } from "@/components/items/lost-items-dashboard"
import { MyItems } from "@/components/profile/my-items"
import { UserProfile } from "@/components/profile/user-profile"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Users, Shield, User } from "lucide-react"

type ViewState = "dashboard" | "post-item" | "browse-items" | "my-items" | "profile"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [showRegister, setShowRegister] = useState(false)
  const [currentView, setCurrentView] = useState<ViewState>("dashboard")

  const handleNavigate = (view: string) => {
    setCurrentView(view as ViewState)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Lost & Found System</h1>
            <p className="text-lg text-muted-foreground">Help reunite people with their lost belongings</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center p-4">
                  <Search className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Search Items</h3>
                  <p className="text-sm text-muted-foreground">Find your lost belongings</p>
                </Card>
                <Card className="text-center p-4">
                  <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Post Found</h3>
                  <p className="text-sm text-muted-foreground">Help others find their items</p>
                </Card>
                <Card className="text-center p-4">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Community</h3>
                  <p className="text-sm text-muted-foreground">Connect with others</p>
                </Card>
                <Card className="text-center p-4">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold">Secure</h3>
                  <p className="text-sm text-muted-foreground">Safe and trusted platform</p>
                </Card>
              </div>
            </div>

            <div>
              {showRegister ? (
                <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
              ) : (
                <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "post-item") {
    return (
      <div className="min-h-screen bg-background">
        <Header onNavigate={handleNavigate} />
        <main className="container mx-auto px-4 py-8">
          <ItemRegistrationForm
            onBack={() => setCurrentView("dashboard")}
            onSuccess={() => setCurrentView("dashboard")}
          />
        </main>
      </div>
    )
  }

  if (currentView === "browse-items") {
    return (
      <div className="min-h-screen bg-background">
        <Header onNavigate={handleNavigate} />
        <main className="container mx-auto px-4 py-8">
          <LostItemsDashboard onBack={() => setCurrentView("dashboard")} />
        </main>
      </div>
    )
  }

  if (currentView === "my-items") {
    return (
      <div className="min-h-screen bg-background">
        <Header onNavigate={handleNavigate} />
        <main className="container mx-auto px-4 py-8">
          <MyItems onBack={() => setCurrentView("dashboard")} />
        </main>
      </div>
    )
  }

  if (currentView === "profile") {
    return (
      <div className="min-h-screen bg-background">
        <Header onNavigate={handleNavigate} />
        <main className="container mx-auto px-4 py-8">
          <UserProfile onBack={() => setCurrentView("dashboard")} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-muted-foreground">What would you like to do today?</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Search className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Browse Lost Items</CardTitle>
              <CardDescription>Search through reported lost items to find yours</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setCurrentView("browse-items")}>
                Start Searching
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Plus className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Report Found Item</CardTitle>
              <CardDescription>Post details about an item you found</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => setCurrentView("post-item")}>
                Post Item
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <User className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>My Items</CardTitle>
              <CardDescription>View and manage your posted items</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" onClick={() => setCurrentView("my-items")}>
                View Items
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
