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

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate?.("dashboard")}
            className="text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Lost & Found
          </button>
        </div>

        {user && onNavigate && (
          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" onClick={() => onNavigate("browse-items")}>
              <Search className="h-4 w-4 mr-2" />
              Browse Items
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("post-item")}>
              <Plus className="h-4 w-4 mr-2" />
              Post Item
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("my-items")}>
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
                  <DropdownMenuItem onClick={() => onNavigate?.("profile")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.("my-items")}>
                    <User className="h-4 w-4 mr-2" />
                    My Items
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
