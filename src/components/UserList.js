import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  Skeleton,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import UserSearchBar from "./UserSearchBar";
import NoresultsPng from "../assets/no-results.png";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const titleStyle = {
    fontFamily: "Impact",
    fontSize: 60,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 0 20px",
    cursor: "pointer",
  };

  const titleContainer = {
    textAlign: "center",
    boxShadow: "#ccc 2px 0px 5px",
    padding: "20px 0 20px",
  };

  const listStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: "calc(100vh - 200px)",
    overflow: "scroll",
  };

  async function getList() {
    setLoading(true);
    await fetch("https://api.github.com/users")
      .then((response) => response.json())
      .then((users) => {
        setUsers(users);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching users:", error);
      });
  }

  useEffect(() => {
    getList();
  }, []);

  return (
    <div style={{ height: "calc(100vh - 20px)", overflowY: "hidden" }}>
      <div style={titleContainer}>
        <h1 style={titleStyle} onClick={() => (window.location.href = "")}>
          <GitHubIcon sx={{ width: 80, height: 80 }} />
          &nbsp;Github
        </h1>
        <UserSearchBar
          setLoading={setLoading}
          users={users}
          onSearch={setUsers}
        />
      </div>
      <List sx={listStyle}>
        {loading ? (
          Array.from({ length: 30 }).map((_, index) => (
            <ListItem
              key={index}
              sx={{
                width: 150,
                margin: 5,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.2)",
                },
              }}
            >
              <Skeleton
                variant="circular"
                sx={{
                  width: 150,
                  height: 150,
                  margin: "0 0 10px",
                  boxShadow: "#ccc 5px 5px 20px",
                }}
              />
              <Skeleton variant="text" width={100} />
            </ListItem>
          ))
        ) : users.length ? (
          users.map((user) => (
            <ListItem
              key={user.id}
              component={Link}
              to={`/user/${user.login}`}
              sx={{
                width: 150,
                margin: 5,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.2)",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={user.login}
                  src={user.avatar_url}
                  sx={{
                    width: 150,
                    height: 150,
                    margin: "0 0 10px",
                    boxShadow: "#ccc 5px 5px 20px",
                  }}
                />
              </ListItemAvatar>
              <Typography variant="h5" color="#555" fontFamily="Helvetica">
                {user.login}
              </Typography>
            </ListItem>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              margin: 20,
            }}
          >
            <img
              src={NoresultsPng}
              alt="no-results"
              style={{
                width: 300,
                height: 300,
              }}
            />
            <br />
            <Typography variant="h5" fontFamily="monospace">
              No results found
            </Typography>
          </div>
        )}
      </List>
    </div>
  );
};

export default UserList;
