import type { Dispatch } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { SearchResult, Topic } from '../types/httpResponseTypes'

interface InitialState {
  topics: Topic[]
  lastSearchResult: SearchResult | null
}

const initialState: InitialState  = {
  topics: [],
  lastSearchResult: null
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setTopics: (state, action) => {
      state.topics = action.payload;
    },
    setSearchResult: (state, action) => {
      state.lastSearchResult = action.payload;
    },
  },
})

export const { setTopics } = searchSlice.actions
export default searchSlice.reducer

export const initSearchSlice = () => {
  return async (dispatch: Dispatch) => {
    return axios.get('/api/search/topics')
      .then(res => dispatch(setTopics(res.data)))
      .then(() => console.log('Finished loading topics'))
  }
}
