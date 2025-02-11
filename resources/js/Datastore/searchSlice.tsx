import type { Dispatch } from '@reduxjs/toolkit'
import type { SearchResult, Topic } from '../types/httpResponseTypes'
import type { RootState } from './store'
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface InitialState {
  topics: Topic[]
  lastSearchResult: SearchResult | null
  lastSearchUrl: string
  lastSearchApiRoute: string
}

const initialState: InitialState = {
  topics: [],
  lastSearchResult: null,
  lastSearchUrl: '/spa/explore',
  lastSearchApiRoute: '',
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setTopics: (state, action) => {
      state.topics = action.payload
    },
    setSearchResult: (state, action) => {
      if (!action.payload) {
        state.lastSearchResult = null
        return
      }

      state.lastSearchResult = action.payload.res
      state.lastSearchApiRoute = action.payload.url
      state.lastSearchUrl = window.location.href
    },
  },
})

export const { setTopics, setSearchResult } = searchSlice.actions
export default searchSlice.reducer

export const initSearchSlice = () => {
  return async (dispatch: Dispatch) => {
    return axios.get('/api/search/topics')
      .then(res => dispatch(setTopics(res.data)))
  }
}

export const searchQuotes = (tagIDs?: string[] | null, authorID?: string | null, keyword?: string | null, token?: string | null) => {
  return searchQuotesUrl(
    `/api/search/${token ? 'auth/' : ''}quotes/?${
      tagIDs?.map(tag => `tags[]=${tag}`).join('&')
    }${authorID ? `&author=${authorID}` : ''}${keyword ? `&keyword=${keyword}` : ''}`,
    token,
  )
}

export const searchQuotesUrl = (url: string, token?: string | null) => {
  return async (dispatch: Dispatch, getState: () => RootState) => {
    const auth = { headers: { Authorization: `Bearer ${token}` } }
    const state = getState()

    if (state.search.lastSearchApiRoute === url) {
      return
    }

    return axios.get(url, auth)
      .then(res => res.data as SearchResult)
      .then((res) => {
        dispatch(setSearchResult({ res, url }))
      })
  }
}
