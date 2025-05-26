import styled from "styled-components";
import { HiSearch } from "react-icons/hi";
import PropTypes from "prop-types";

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:focus-within {
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 2px var(--color-brand-100);
  }
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  font-size: 1.4rem;
  color: var(--color-grey-600);
  width: 20rem;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--color-grey-400);
  }
`;

const SearchIcon = styled(HiSearch)`
  width: 2rem;
  height: 2rem;
  color: var(--color-grey-400);
`;

function SearchBar({ searchQuery, onSearch }) {
  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput
        placeholder="Search by guest name..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
      />
    </SearchContainer>
  );
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;

//<SearchBar onSearch={handleSearch} searchQuery={searchQuery} />
