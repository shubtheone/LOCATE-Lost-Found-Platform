"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Search, User, LogOut, Plus, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  onNavigate?: (view: string) => void
}

export function Header({ onNavigate }: HeaderProps) {
  const { user, logout } = useAuth()

  // This function ensures onNavigate is called correctly
  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view)
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleNavigation("dashboard")}
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Lost & Found
          </button>
        </div>

        {user && (
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" onClick={() => handleNavigation("browse-items")}>
              <Search className="h-4 w-4 mr-2" />
              Browse Items
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleNavigation("post-item")}>
              <Plus className="h-4 w-4 mr-2" />
              Post Item
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleNavigation("my-items")}>
              My Items
            </Button>
          </nav>
        )}

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* Correctly calling the navigation handler */}
                  <DropdownMenuItem onClick={() => handleNavigation("profile")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("my-items")}>
                    <User className="h-4 w-4 mr-2" />
                    My Items
                  </DropdownMenuItem>
                  {/* The logout functionality in the dropdown will be kept, but we add a new button as well */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* --- NEW DEDICATED LOGOUT BUTTON --- */}
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2 md:hidden lg:block" />
                Sign Out
              </Button>

            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}