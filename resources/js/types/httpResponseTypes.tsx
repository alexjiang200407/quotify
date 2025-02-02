export interface Author {
  id: number
  fullName: string
  wikiPage: string
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
  author: Author
  tags: Tag[]
}

export interface HTTPErrorResponse {
  error: string
}

export interface AuthToken {
  token: string
}
