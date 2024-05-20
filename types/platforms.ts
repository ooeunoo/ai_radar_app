export interface Platform {
  id: number
  slug: string
  category: string
  developer: string
  title: string
  description: string
  logo?: string
  images: string[]
  overview: string
  website: string
  docs: string
  approved: boolean
}
