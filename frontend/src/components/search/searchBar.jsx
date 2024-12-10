import React, { useState } from 'react';
import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';
import { debounce } from 'lodash';
import axios from 'axios';

const SearchContainer = styled(Paper)`
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 30px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchInput = styled(InputBase)`
  flex: 1;
  margin-left: 8px;
`;

const SearchBar = ({ setSearchQuery, fetchResults }) => {


  const uri = process.env.REACT_APP_URI;

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchResults(query); 
};

  return (
    <SearchContainer>
      <IconButton>
        <SearchIcon />
      </IconButton>
      <SearchInput
        placeholder="Search..."
        inputProps={{ 'aria-label': 'search' }}
        onChange={handleSearch}
      />
    </SearchContainer>
  );
};

export default SearchBar;