import React, { useState } from 'react';
import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import axios from 'axios';

const SearchContainer = styled(Paper)`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled(InputBase)`
  flex: 1;
  margin-left: 8px;
`;

const SearchBar = () => {


  const uri = "http://localhost:5050/api";

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      axios.post(`${uri}/users/addFollower`, { username: searchQuery })
      .then(response => {
        console.log(response.data); 
      })
    }
  };

  return (
    <SearchContainer>
      <IconButton>
        <SearchIcon />
      </IconButton>
      <SearchInput
        placeholder="Search..."
        inputProps={{ 'aria-label': 'search' }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleSearch}
      />
    </SearchContainer>
  );
};

export default SearchBar;