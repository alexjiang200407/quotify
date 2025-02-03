import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Autocomplete, createFilterOptions, Divider, FilterOptionsState, IconButton, InputBase, Paper, Popper, styled, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { Topics as Topic, Tag } from '../types/httpResponseTypes'
import axios from 'axios'
import { useNotification } from './NotificationProvider'

export interface SearchBarProps {
  label: string
  onSearch: (tags: Topic[], keyword: string) => void
};

const CustomPopper = styled(Popper)({
  top: "10px !important",
  zIndex: 1300, // Ensures it's above other elements
});


function SearchBar(props: SearchBarProps) {

  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTags, setSelectedTags] = useState<Topic[]>([])
  const [authorSelected, setAuthorSelected] = useState<boolean>(false)
  const {handleHttpError} = useNotification();
  const keywordRef = useRef<HTMLInputElement|undefined>(undefined)
  const GROUP_OPTION_COUNT = 3

  useState(() => {
    axios.get('/api/search/topics')
    .then(res => setTopics(res.data))
    .catch(handleHttpError)
  })

  const setSelectedTopics = (topics: Topic[]) => {
    let temp: boolean = false;
    setSelectedTags(topics.map(t => {
      temp = temp || t.type === 'author'
      return t
    }))
    setAuthorSelected(temp)
  }

  const filterTopics = (topics: Topic[], state: FilterOptionsState<Topic>): Topic[] => {
    let authorsChosen = 0;
    let tagsChosen = 0;
    return topics.filter(topic => {
      if (!topic.label.includes(state.inputValue))
        return false;

      if (topic.type === 'tag')
        return (tagsChosen < GROUP_OPTION_COUNT * (Number(authorSelected) + 1)) && ++tagsChosen

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
        slots={{popper: CustomPopper}}
        limitTags={2}
        id="multiple-limit-tags"
        sx={{ flex: 1, paddingInline: 2 }}
        openOnFocus
        groupBy={tag => tag.type}
        options={topics}
        getOptionLabel={tag => tag.label}
        onChange={(_, newValue) => setSelectedTopics(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={props.label}
            variant='standard'
            inputRef={keywordRef}
            sx={{
              paddingBlock: 1,
              "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                display: "none"
              }
            }}
          />
        )}
      />

      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton sx={{ mr: 1 }} onClick={() => props.onSearch(selectedTags, keywordRef.current?.value ?? '') }>
        <FontAwesomeIcon icon={faSearch} />
      </IconButton>
    </Paper>
  )
}

export default SearchBar
