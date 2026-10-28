// ============================================================
// AutoBarn — Shared TypeScript Types
// ============================================================

// ─── SANITY IMAGE ─────────────────────────────────────────────
// Base type shared across all Sanity image references.
// VehicleImage extends this with vehicle-specific fields.

export interface SanityImage {
  _key?:    string
  asset:    { _ref: string }
  url:      string   // resolved by GROQ: asset->url
  alt?:     string
}

// ─── VEHICLES (from Sanity) ──────────────────────────────────

export type FuelType      = 'petrol' | 'diesel' | 'hybrid' | 'electric'
export type Transmission  = 'automatic' | 'manual'
export type VehicleStatus = 'available' | 'sold' | 'reserved' | 'coming_soon'

export interface VehicleImage extends SanityImage {
  caption?: string
}

export interface Vehicle {
  _id:          string
  _type:        'vehicle'
  slug:         string   // GROQ: slug.current
  make:         string
  model:        string
  trim?:        string
  year:         number
  price:        number
  mileage:      number
  fuelType:     string   // GROQ projected as fuelType
  fuel?:        FuelType
  transmission: string
  colour?:      string
  colourHex?:   string
  status:       VehicleStatus
  badge?:       'new_arrival' | 'special' | 'featured'
  images:       VehicleImage[]
  description?: string
  features?:    string[]
}

export interface VehicleFilters {
  minPrice?:    number
  maxPrice?:    number
  year?:        number
  fuelType?:    string
  transmission?: string
  maxMileage?:  number
  colour?:      string
}

// ─── DETAILING PRODUCTS (from Sanity) ────────────────────────

export type ProductCategory = 'brush' | 'microfibre' | 'wax' | 'other'

export interface Product {
  _id:          string
  _type:        'product'
  slug:         string
  name:         string
  category:     string
  price:        number
  comparePrice?: number
  onSale:       boolean
  isSpecial?:   boolean
  colour?:      string
  colourHex?:   string
  image?:       VehicleImage
  images?:      VehicleImage[]
  description?: string
  inStock:      boolean
}

export interface ProductFilters {
  minPrice?:    number
  maxPrice?:    number
  categories?:  ProductCategory[]
  onSale?:      boolean
  colours?:     string[]
}

// ─── BLOG (from Sanity) ──────────────────────────────────────

export type BlogCategory = 'news' | 'tips' | 'vehicles' | 'company'

export interface Author {
  name:   string
  image?: SanityImage   // author portraits use the base image type (no caption)
}

export interface BlogPost {
  _id:          string
  _type:        'post'
  slug:         string
  title:        string
  excerpt:      string
  coverImage?:  SanityImage   // cover images don't carry vehicle-specific fields
  category?:    string
  author?:      Author
  publishedAt:  string
  readTime?:    number
  body?:        unknown[]
}

// ─── WASH SERVICES ───────────────────────────────────────────

export interface WashService {
  _id:          string
  name:         string
  tier:         'regular' | 'premium' | 'premium_plus'
  price:        number
  duration?:    string
  description?: string
  includes:     string[]   // what's done (use 'inclusions' as alias in queries)
  badge?:       string
}

// ─── BOOKINGS / FORMS ────────────────────────────────────────

export type BookingType = 'test_drive' | 'car_wash' | 'detailing' | 'enquiry'

export interface BookingFormData {
  firstName:        string
  lastName:         string
  email:            string
  phone:            string
  bookingType:      BookingType
  vehicleInterest?: string
  preferredDate:    string
  preferredTime?:   string
  message?:         string
  consentToProcess: true
}

export interface EnquiryFormData {
  firstName:        string
  lastName:         string
  email:            string
  phone?:           string
  subject:          string
  message:          string
  consentToProcess: true
}

// ─── API RESPONSES ───────────────────────────────────────────

export interface ApiSuccess<T = null> {
  success: true
  data:    T
}

export interface ApiError {
  success:  false
  error:    string
  details?: Record<string, string[]>
}

export type ApiResponse<T = null> = ApiSuccess<T> | ApiError

// ─── UI ──────────────────────────────────────────────────────

export type ToastSeverity = 'success' | 'warning' | 'error' | 'info'

export interface Toast {
  id:        string
  message:   string
  severity:  ToastSeverity
  duration?: number
}

// ─── NAVIGATION ──────────────────────────────────────────────

export interface NavLink {
  label: string
  href:  string
}

// ─── SANITY IMAGE HELPER ─────────────────────────────────────
// Minimal shape accepted by the Sanity image URL builder.
// Components that need full image metadata should use SanityImage instead.

export type SanityImageSource = Pick<SanityImage, 'asset' | 'alt'>
