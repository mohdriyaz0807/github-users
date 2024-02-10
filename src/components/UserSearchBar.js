import React, { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

const UserSearchBar = ({ onSearch, users, setLoading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearch, setLastSearch] = useState({ show: false, text: "" });

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      setLastSearch({ show: true, text: searchTerm });
      setLoading(true);
      const response = await fetch(
        `https://api.github.com/search/users?q=${searchTerm}`
      );
      const data = await response.json();
      onSearch(data.items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error searching users:", error);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
      e.target.blur();
    }
  };

  return (
    <>
      <TextField
        placeholder="Search for users..."
        variant="outlined"
        autoComplete="off"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyPress}
        InputProps={{
          className: "search-input",
          endAdornment: (
            <InputAdornment position="end">
              {searchTerm ? (
                <IconButton onClick={handleClear}>
                  <ClearIcon />
                </IconButton>
              ) : null}
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: "50px",
            height: "40px",
            width: "35vw",
            padding: "0 5px",
            marginBottom: "10px",
          },
        }}
      />
      {lastSearch.show ? (
        <Typography color="#999">
          showing {<b>{users.length}</b>} results for matching{" "}
          {<b>{lastSearch.text}</b>}
        </Typography>
      ) : (
        <div style={{ height: "25px" }} />
      )}
    </>
  );
};

export default UserSearchBar;
