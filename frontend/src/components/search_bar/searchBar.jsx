import React from 'react';
import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from '@emotion/styled';

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
  return (
    <SearchContainer>
      <IconButton>
        <SearchIcon />
      </IconButton>
      <SearchInput
        placeholder="Search..."
        inputProps={{ 'aria-label': 'search' }}
      />
    </SearchContainer>
  );
};

export default SearchBar;