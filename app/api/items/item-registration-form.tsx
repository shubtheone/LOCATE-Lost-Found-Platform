"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ITEM_CATEGORIES } from "@/types/item"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ItemRegistrationFormProps {
  onBack: () => void
  onSuccess: () => void
}

export function ItemRegistrationForm({ onBack, onSuccess }: ItemRegistrationFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [dateFound, setDateFound] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { user } = useAuth()
  const { toast } = useToast()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 4MB.",
          variant: "destructive",
        })
        return;
      }
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    if (!title || !description || !category || !location || !dateFound || !contactInfo) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    let uploadedImageUrl: string | undefined = undefined;

    // Step 1: Upload image if it exists
    if (imageFile) {
      try {
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(imageFile.name)}`, {
          method: "POST",
          body: imageFile,
        });

        if (!response.ok) {
          throw new Error("Image upload failed");
        }
        const newBlob = await response.json();
        uploadedImageUrl = newBlob.url;
      } catch (error) {
        console.error(error);
        toast({
          title: "Image Upload Failed",
          description: "There was a problem uploading your image. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Step 2: Submit the rest of the form with the image URL
    try {
      const token = localStorage.getItem("lf_token")
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          category,
          location,
          dateFound,
          contactInfo,
          imageUrl: uploadedImageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to post item")
      }

      toast({
        title: "Success!",
        description: "Your found item has been posted successfully",
      })
      onSuccess() // Navigate back
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post item. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Report Found Item</h1>
        <p className="text-muted-foreground mt-2">
          Help someone find their lost belonging by providing detailed information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>
            Provide as much detail as possible. An image is highly recommended!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ... (other form fields like title, category, etc.) ... */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Item Title *</Label>
                <Input id="title" placeholder="e.g., Black iPhone 13" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{ITEM_CATEGORIES.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" placeholder="Describe the item in detail (color, brand, condition, distinctive features, etc.)" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location Found *</Label>
                <Input id="location" placeholder="e.g., Central Park, Building A Room 101" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFound">Date Found *</Label>
                <Input id="dateFound" type="date" value={dateFound} onChange={(e) => setDateFound(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information *</Label>
              <Input id="contactInfo" placeholder="Phone number or email for the owner to contact you" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} required />
              <p className="text-sm text-muted-foreground">This will be visible to users searching for their items.</p>
            </div>

            {/* --- NEW IMAGE UPLOAD SECTION --- */}
            <div className="space-y-2">
              <Label>Item Photo</Label>
              {imagePreview ? (
                <div className="relative w-full h-52">
                  <Image src={imagePreview} alt="Selected item preview" layout="fill" objectFit="contain" className="rounded-md border" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={removeImage}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove Image</span>
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">PNG, JPG, GIF up to 4MB</p>
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleImageChange} 
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Posting Item..." : "Post Found Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}