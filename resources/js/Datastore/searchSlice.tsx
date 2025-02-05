import type { Dispatch } from '@reduxjs/toolkit'
import type { SearchResult, Topic } from '../types/httpResponseTypes'
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface InitialState {
  topics: Topic[]
  lastSearchResult: SearchResult | null
}

const initialState: InitialState = {
  topics: [],
  lastSearchResult: null,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setTopics: (state, action) => {
      state.topics = action.payload
    },
    setSearchResult: (state, action) => {
      state.lastSearchResult = action.payload
    },
  },
})

export const { setTopics, setSearchResult } = searchSlice.actions
export default searchSlice.reducer

export function initSearchSlice() {
  return async (dispatch: Dispatch) => {
    return axios.get('/api/search/topics')
      .then(res => dispatch(setTopics(res.data)))
  }
}

export function searchQuotes(tagIDs?: string[] | null, authorID?: string | null, keyword?: string | null, token?: string | null) {
  return searchQuotesUrl(
    `/api/search/${token ? 'auth/' : ''}quotes/?${
      tagIDs?.map(tag => `tags[]=${tag}`).join('&')
    }${authorID ? `&author=${authorID}` : ''}${keyword ? `&keyword=${keyword}` : ''}`,
    token,
  )
}

export function searchQuotesUrl(url: string, token?: string | null) {
  return async (dispatch: Dispatch) => {
    const auth = { headers: { Authorization: `Bearer ${token}` } }
    return axios.get(url, auth)
      .then(res => res.data as SearchResult)
      .then((res) => {
        dispatch(setSearchResult(res))
      })
  }
}
