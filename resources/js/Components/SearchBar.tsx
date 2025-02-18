import type { FilterOptionsState } from '@mui/material'
import type { Topic } from '../types/httpResponseTypes'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Autocomplete, Chip, Divider, IconButton, InputAdornment, Paper, Popper, styled, TextField } from '@mui/material'
import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../Datastore/hooks'

export interface SearchBarProps {
  label: string
};

const CustomPopper = styled(Popper)({
  top: '10px !important',
  zIndex: 1300, // Ensures it's above other elements
})

interface SearchBarContextType {
  setSelectedTopics: (topics: Topic[]) => void
  authorSelected: boolean
  selectedTags: Map<string, Topic>
  tagCount: number
  addTopic: (idAndType: [number, string][], clear?: boolean) => void
  goToPage: (tags: number[], author: number | null, keyword: string | null) => void
  selectedQuoteIndex: number | null
  setSelectedQuoteIndex: (idx: number | null) => void
  setInputValue: (keyword: string) => void
  inputValue: string
}

interface SearchBarProviderProps {
  children: React.ReactNode
}

const SearchBarContext = createContext<SearchBarContextType>({
  setSelectedTopics: (_: Topic[]) => { console.warn('SearchBar Provider not setup') },
  authorSelected: false,
  selectedTags: new Map(),
  tagCount: 0,
  addTopic: (_1: [number, string][], _2?: boolean) => console.warn('SearchBar Provider not setup'),
  goToPage: (_1: number[], _2: number | null, _3: string | null) => console.warn('SearchBar Provider not setup'),
  selectedQuoteIndex: null,
  setSelectedQuoteIndex: (_: number | null) => console.warn('SearchBar Provider not setup'),
  setInputValue: (_: string) => console.warn('SearchBar Provider not setup'),
  inputValue: '',
})

export const useSearchBar = () => useContext(SearchBarContext)

export const SearchBarProvider = ({ children }: SearchBarProviderProps) => {
  const topics = useAppSelector(state => state.search.topics)
  const [selectedTags, setSelectedTags] = useState<Map<string, Topic>>(new Map())
  const [tagCount, setTagCount] = useState(0)
  const [authorSelected, setAuthorSelected] = useState<boolean>(false)
  const [selectedQuoteIndex, setSelectedQuoteIndex] = useState<number | null>(null)
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')

  const makeTopicID = (t: Topic) => {
    return `${t.type}---${t.id}`
  }

  const setSelectedTopics = (topics: Topic[], append: boolean = false) => {
    const temp = topics.some(t => t.type === 'author')
    if (append) {
      setSelectedTags(prev => new Map([...prev, ...(topics.map(t => [makeTopicID(t), t]) as [string, Topic][])]))
      setAuthorSelected(prev => prev || temp)
      setTagCount(prev => prev + topics.filter(t => t.type === 'tag').length)
    }
    else {
      setSelectedTags(new Map(topics.map(t => [makeTopicID(t), t])))
      setAuthorSelected(temp)
      setTagCount(topics.filter(t => t.type === 'tag').length)
    }
  }

  const addTopic = (idAndType: [number, string][], clear: boolean = false) => {
    if (!clear) {
      setSelectedTopics(idAndType.flatMap(([id, type]) => topics.find(t => t.id === id && t.type === type) ?? []), true)
    }
    else {
      setSelectedTopics(idAndType.flatMap(([id, type]) => topics.find(t => t.id === id && t.type === type) ?? []))
      setInputValue('')
    }
  }

  const goToPage = (tags: number[], author: number | null, keyword: string | null) => {
    setSelectedQuoteIndex(null)

    const authorQueryStr = author ? `author=${author}&` : ''
    const tagQueryStr = tags.length ? `tags=${tags.join(',')}&` : ''
    const keywordQueryStr = keyword !== null ? `keyword=${keyword}` : ''

    navigate(`/spa/explore?${tagQueryStr}${authorQueryStr}${keywordQueryStr}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const topics = [...tags.map(t => [t, 'tag'] as [number, string])]

    if (author)
      topics.push([author, 'author'])

    addTopic(topics, true)
    if (keyword)
      setInputValue(keyword)
  }

  return (
    <SearchBarContext.Provider value={{
      setSelectedTopics,
      authorSelected,
      selectedTags,
      addTopic,
      tagCount,
      goToPage,
      setSelectedQuoteIndex,
      selectedQuoteIndex,
      setInputValue,
      inputValue,
    }}
    >
      {children}
    </SearchBarContext.Provider>
  )
}

export const SearchBar = (props: SearchBarProps) => {
  const GROUP_OPTION_COUNT = 3
  const topics = useAppSelector(state => state.search.topics)
  const { authorSelected, selectedTags, tagCount, goToPage, inputValue, setInputValue } = useSearchBar()

  const filterTopics = (topics: Topic[], state: FilterOptionsState<Topic>): Topic[] => {
    let authorsChosen = 0
    let tagsChosen = 0

    return topics.filter((topic) => {
      if (!topic.label.toLowerCase().includes(state.inputValue.toLowerCase()))
        return false

      if (topic.type === 'tag') {
        return tagCount < 4 && tagsChosen < GROUP_OPTION_COUNT * (Number(authorSelected) + 1) && tagsChosen <= 4 && ++tagsChosen
      }

      return (!authorSelected && authorsChosen < GROUP_OPTION_COUNT) && ++authorsChosen
    })
  }

  const onSearch = (searchTags: Topic[], keyword: string) => {
    const author = searchTags.find(t => t.type === 'author')
    const tags = searchTags.flatMap(t => t.type === 'tag' ? t.id : [])

    goToPage(tags, author?.id ?? null, keyword === '' ? null : keyword)
  }

  const keyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Prevents the default selection behavior
      onSearch([...selectedTags.values()], inputValue)
    }
  }

  return (
    <Autocomplete
      clearOnBlur={false}
      fullWidth
      multiple
      filterSelectedOptions={true}
      filterOptions={filterTopics}
      slots={{
        popper: CustomPopper,
      }}
      limitTags={2}
      id="multiple-limit-tags"
      sx={{ flex: 1 }}
      openOnFocus
      inputValue={inputValue}
      value={[...selectedTags.values()]}
      isOptionEqualToValue={(t1, t2) => t1.id === t2.id && t1.type === t2.type}
      groupBy={tag => tag.type}
      options={topics}
      getOptionLabel={tag => tag.label}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      onChange={(_, newValue) => { onSearch(newValue, '') }}
      onKeyDown={keyDown}
      renderInput={params => (
        
        <TextField
          {...params}
          placeholder={props.label}
          variant="outlined"
          sx={{
            'paddingBlock': 1,
            '& .MuiInput-underline:before, & .MuiInput-underline:after': {
              display: 'none',
            },
            '& .MuiInputBase-root': {
              paddingRight: '0 !important'
            },
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
          size='small'
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
              <InputAdornment position='end'>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton sx={{ mr: 1 }} onClick={() => onSearch([...selectedTags.values()], inputValue ?? '')}>
                  <FontAwesomeIcon icon={faSearch} />
                </IconButton>
              </InputAdornment>       
              )
            }
          }}
        >

        </TextField>
      )}
    />
  )
}

export default SearchBar
