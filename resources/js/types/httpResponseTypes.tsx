import type { AxiosError } from 'axios'

export interface Signature {
  id: number
  font_size: number
  duration: number
  stroke_width: number
  color: string
  type: string
  letter_spacing: number
}

export interface User {
  id: number
  name: string
  email: string
}

export interface Author {
  id: number
  full_name: string
  wiki_page: string
  signature: Signature
  description: string
}
export interface Tag {
  id: number
  label: string
}

export interface Topic {
  id: number
  popularity: number
  label: string
  type: string
}

export interface Quote {
  id: number
  quote: string
  upvotes: number
  saves: number
  user_upvoted: boolean
  user_saved: boolean
  author: Author
  tags: Tag[]
}

export interface PageLink {
  url: string | null
  label: string
  active: boolean
}

export interface SearchResult {
  current_page: number
  data: Quote[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PageLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: null
  to: number
  total: number
}

export interface HTTPErrorResponse {
  error: string
}

export interface AuthToken {
  token: string
}

export type QuotifyAPIError = AxiosError<HTTPErrorResponse>
