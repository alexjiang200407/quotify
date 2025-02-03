import type { AxiosError } from 'axios'

export interface Author {
  id: number
  full_name: string
  wiki_page: string
  description: string
}
export interface Tag {
  id: number
  label: string
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
