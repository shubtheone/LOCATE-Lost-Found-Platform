export interface FoundItem {
  id: string
  title: string
  description: string
  category: string
  location: string
  dateFound: string
  contactInfo: string
  imageUrl?: string
  postedBy: string
  postedByName: string
  createdAt: string
  status: "available" | "claimed" | "returned"
}

export const ITEM_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Documents",
  "Keys",
  "Bags",
  "Jewelry",
  "Sports Equipment",
  "Books",
  "Other",
] as const

export type ItemCategory = (typeof ITEM_CATEGORIES)[number]
