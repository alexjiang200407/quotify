import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Autocomplete, createFilterOptions, Divider, IconButton, InputBase, Paper, Popper, styled, TextField } from '@mui/material'
import React, { useState } from 'react'
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
  const [keyword, setKeyword] = useState('');

  useState(() => {
    axios.get('/api/search/topics')
    .then(res => setTopics(res.data))
    .catch(handleHttpError)
  })

  const setSelectedTopics = (topics: Topic[]) => {
    setAuthorSelected(false);
    setSelectedTags(topics.map(t => {
      setAuthorSelected(authorSelected || t.type == 'author')
      return t
    }))
  }

  return (
    <Paper
      component="form"
      sx={{ display: 'inline-flex', alignItems: 'center', borderRadius: 10, flex: 1 }}
    >
      <Autocomplete
        // freeSolo
        fullWidth
        multiple
        filterSelectedOptions={true}
        // filterOptions={options => authorSelected && options.filter === 'author'}
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
            onChange={e => setKeyword(e.target.value)}
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
      <IconButton sx={{ mr: 1 }} onClick={() => props.onSearch(selectedTags, keyword)}>
        <FontAwesomeIcon icon={faSearch} />
      </IconButton>
    </Paper>
  )
}

export default SearchBar
