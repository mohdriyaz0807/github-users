import React, { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Button,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";

const UserSearchBar = ({ onSearch, users, setLoading, getList }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [lastSearch, setLastSearch] = useState({ show: false, text: "", location: "" });
  const [searchTermLocation, setSearchTermLocation] = useState("")

  const handleSearch = async () => {
    if (!searchTerm.trim() && !searchTermLocation.trim()) {
      getList()
      setLastSearch({ show: false, text: "", location: "" })
      return;
    }
    try {
      setLastSearch({ show: true, text: searchTerm, location: searchTermLocation });
      setLoading(true);
      const response = await fetch(
        `https://api.github.com/search/users?q=${searchTerm}+location:${searchTermLocation}`
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
      <div>
      <TextField
        placeholder="Search for location..."
        variant="outlined"
        autoComplete="off"
        value={searchTermLocation}
        onChange={(e) => setSearchTermLocation(e.target.value)}
        InputProps={{
          className: "search-input",
          endAdornment: (
            <InputAdornment position="end">
              {searchTermLocation ? (
                <IconButton onClick={() => setSearchTermLocation("")}>
                  <ClearIcon />
                </IconButton>
              ) : null}
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
      </div>
      <Button sx={{margin: "10px 0"}} variant="contained" onClick={handleSearch}>Search</Button>
      {lastSearch.show ? (
        <Typography color="#999">
          showing {<b>{users.length}</b>} results for matching{" "}
          {<b>{lastSearch.text}</b>}{" "}
          {lastSearch.location ? `and ${lastSearch.location}` : ""}
        </Typography>
      ) : (
        <div style={{ height: "25px" }} />
      )}
    </>
  );
};

export default UserSearchBar;
