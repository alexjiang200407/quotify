import type { FilterOptionsState } from '@mui/material'
import type { Topic as Topic } from '../types/httpResponseTypes'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Autocomplete, Divider, IconButton, Paper, Popper, styled, TextField } from '@mui/material'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../Datastore/hooks'

export interface SearchBarProps {
  label: string
  onSearch: (tags: Topic[], keyword: string) => void
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
})

export const useSearchBar = () => useContext(SearchBarContext)

export function SearchBarProvider({ children }: SearchBarProviderProps) {
  const topics = useAppSelector(state => state.search.topics)
  const [selectedTags, setSelectedTags] = useState<Map<string, Topic>>(new Map())
  const [tagCount, setTagCount] = useState(0)
  const [authorSelected, setAuthorSelected] = useState<boolean>(false)

  const makeTopicID = (t: Topic) => {
    return `${t.type}---${t.id}`
  }

  const setSelectedTopics = (topics: Topic[], append: boolean = false) => {
    const temp = topics.some((t) => t.type === 'author');
    if (append) {
      setSelectedTags(prev => new Map([...prev, ...(topics.map(t => [makeTopicID(t), t]) as [string, Topic][])]));
      setAuthorSelected(prev => prev || temp);
      setTagCount(prev => prev + topics.filter(t => t.type === 'tag').length)
    }
    else {
      setSelectedTags(new Map(topics.map(t => [makeTopicID(t), t])));
      setAuthorSelected(temp);
      setTagCount(topics.filter(t => t.type === 'tag').length)
    }
  }

  const addTopic = (idAndType: [number, string][], clear: boolean = false) => {
    if (!clear)
      setSelectedTopics(idAndType.flatMap(([id, type]) => topics.find(t => t.id === id && t.type === type) ?? []), true)
    else
      setSelectedTopics(idAndType.flatMap(([id, type]) => topics.find(t => t.id === id && t.type === type) ?? []))
    
  }

  return (
    <SearchBarContext.Provider value={{ setSelectedTopics, authorSelected, selectedTags, addTopic, tagCount }}>
      {children}
    </SearchBarContext.Provider>
  )
}

export function SearchBar(props: SearchBarProps) {
  const keywordRef = useRef<HTMLInputElement | undefined>(undefined)
  const GROUP_OPTION_COUNT = 3
  const topics = useAppSelector(state => state.search.topics)
  const { authorSelected, selectedTags, setSelectedTopics, tagCount } = useSearchBar()

  const filterTopics = (topics: Topic[], state: FilterOptionsState<Topic>): Topic[] => {
    let authorsChosen = 0
    let tagsChosen = 0

    return topics.filter((topic) => {
      if (!topic.label.includes(state.inputValue))
        return false

      if (topic.type === 'tag') {
        return tagCount < 4 && tagsChosen < GROUP_OPTION_COUNT * (Number(authorSelected) + 1) && tagsChosen <= 4 && ++tagsChosen
      }

      return (!authorSelected && authorsChosen < GROUP_OPTION_COUNT) && ++authorsChosen
    })
  }
  return (
    <Paper
      component="form"
      sx={{ display: 'inline-flex', alignItems: 'center', borderRadius: 10, flex: 1 }}
    >
      <Autocomplete
        clearOnBlur={false}
        fullWidth
        multiple
        filterSelectedOptions={true}
        filterOptions={filterTopics}
        slots={{ popper: CustomPopper }}
        limitTags={2}
        id="multiple-limit-tags"
        sx={{ flex: 1, paddingInline: 2 }}
        openOnFocus
        value={[...selectedTags.values()]}
        isOptionEqualToValue={(t1, t2) => t1.id === t2.id && t1.type === t2.type}
        groupBy={tag => tag.type}
        options={topics}
        getOptionLabel={tag => tag.label}
        onChange={(_, newValue) => { props.onSearch(newValue, keywordRef.current?.value ?? '') }}
        renderInput={params => (
          <TextField
            {...params}
            placeholder={props.label}
            variant="standard"
            inputRef={keywordRef}
            sx={{
              'paddingBlock': 1,
              '& .MuiInput-underline:before, & .MuiInput-underline:after': {
                display: 'none',
              },
            }}
          />
        )}
      />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton sx={{ mr: 1 }} onClick={() => props.onSearch([...selectedTags.values()], keywordRef.current?.value ?? '')}>
        <FontAwesomeIcon icon={faSearch} />
      </IconButton>
    </Paper>
  )
}

export default SearchBar
