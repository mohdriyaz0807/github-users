import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import NoresultsPng from "../assets/no-results.png";
import GitHubIcon from "@mui/icons-material/GitHub";
import BusinessIcon from "@mui/icons-material/Business";
import XIcon from "@mui/icons-material/X";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import CircleIcon from "@mui/icons-material/Circle";

const UserDetails = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const titleStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 20px",
    marginTop: 0,
    backgroundColor: "#ededed",
  };

  async function getRepos(name) {
    setReposLoading(true);
    await fetch(`https://api.github.com/users/${name}/repos?per_page=50`)
      .then((response) => response.json())
      .then((data) => {
        setRepos(data);
        setReposLoading(false);
      })
      .catch((error) => {
        setError("Something went wrong");
        setReposLoading(false);
        console.error("Error fetching user details:", error);
      });
  }

  useEffect(() => {
    async function getUser() {
      await fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((userData) => {
          if (userData.message) {
            setError("User not found");
          } else {
            setUser(userData);
            getRepos(username);
          }
          setLoading(false);
        })
        .catch((error) => {
          setError("Something went wrong");
          setLoading(false);
          console.error("Error fetching user details:", error);
        });
    }
    getUser();
  }, [username]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate = `${months[date.getMonth()]} ${String(
      date.getDate()
    ).padStart(2, "0")}, ${date.getFullYear()}`;

    return formattedDate;
  };

  const languageColors = {};

  const generateLanguageColor = (language) => {
    if (languageColors[language]) {
      return languageColors[language];
    }
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    languageColors[language] = color;

    return color;
  };

  return (
    <>
      <h1 style={titleStyle}>
        <GitHubIcon sx={{ width: 32, height: 32 }} />
        &nbsp;
        {user?.login ? (
          <Button
            sx={{
              textTransform: "none",
              fontSize: "18px",
              color: "black",
              borderRadius: "10px",
            }}
            href={user?.html_url}
            target="_blank"
          >
            {user.login}
          </Button>
        ) : null}
      </h1>
      {!loading ? (
        error ? (
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
              {error}
            </Typography>
          </div>
        ) : (
          <Grid container spacing={3}>
            <Grid
              item
              xs={10}
              sm={10}
              md={3}
              lg={3}
              xl={3}
              sx={{ margin: "auto" }}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <div>
                <Avatar
                  src={user.avatar_url}
                  alt={user.login}
                  sx={{ width: 300, height: 300 }}
                />
                <div style={{ margin: "15px 0" }}>
                  <Typography variant="h4">{user.name}</Typography>
                  <Typography color="GrayText" variant="subtitle1">
                    {user.login}
                  </Typography>
                  <Typography variant="body1">{user.bio}</Typography>
                </div>
                {user.company ? (
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      margin: "10px 0",
                    }}
                  >
                    <BusinessIcon />
                    &nbsp;&nbsp;
                    <div>
                      {user.company.includes("@")
                        ? user.company.split(", ").map((url, index) => {
                            return (
                              <>
                                <a
                                  className="company-link"
                                  href={`https://github.com/${url}`}
                                  rel="noreferrer"
                                  target="_blank"
                                >
                                  <b>{url}</b>
                                </a>
                                &nbsp;
                              </>
                            );
                          })
                        : user.company}
                    </div>
                  </Typography>
                ) : null}
                <Typography
                  variant="body1"
                  sx={{
                    display: "flex",
                    alignItems: "start",
                    margin: "10px 0",
                  }}
                >
                  <PeopleAltIcon />
                  &nbsp;&nbsp;
                  <a
                    className="followers-link"
                    href={`${user.html_url}?tab=followers`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <b>{user.followers || 0}</b>&nbsp;Followers
                  </a>
                  &nbsp;·&nbsp;
                  <a
                    className="followers-link"
                    href={`${user.html_url}?tab=following`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <b>{user.following || 0}</b>&nbsp;Following
                  </a>
                </Typography>
                {user.location ? (
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      margin: "10px 0",
                    }}
                  >
                    <PlaceIcon />
                    &nbsp;&nbsp;{user.location}
                  </Typography>
                ) : null}
                {user.email ? (
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      margin: "10px 0",
                    }}
                  >
                    <EmailIcon />
                    &nbsp;&nbsp;
                    <a
                      href={user.email}
                      rel="noreferrer"
                      target="_blank"
                      className="anchor-link"
                    >
                      {user.email}
                    </a>
                  </Typography>
                ) : null}
                {user.blog ? (
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      margin: "10px 0",
                    }}
                  >
                    <LinkIcon />
                    &nbsp;&nbsp;
                    <a
                      href={user.blog}
                      rel="noreferrer"
                      target="_blank"
                      className="anchor-link"
                    >
                      {user.blog}
                    </a>
                  </Typography>
                ) : null}
                {user.twitter ? (
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "start",
                      margin: "10px 0",
                    }}
                  >
                    <XIcon />
                    &nbsp;&nbsp;
                    <a
                      href={user.twitter}
                      rel="noreferrer"
                      target="_blank"
                      className="anchor-link"
                    >
                      {user.twitter}
                    </a>
                  </Typography>
                ) : null}
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={7}
              lg={7}
              xl={7}
              sx={{
                margin: "24px 20px 0 40px",
                border: "0.5px solid #999",
                borderRadius: "10px",
                padding: 3,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Repositories&nbsp;
                <Chip label="public" color="info" size="small" />
                &nbsp;
                <Chip
                  label={user.public_repos}
                  variant="elevated"
                  size="small"
                />
              </Typography>
              <hr />
              {!reposLoading ? (
                repos.length ? (
                  <div className="repo-container">
                    {repos.map((repo, index) => (
                      <div key={index} className="repo-item">
                        <Typography>
                          <a
                            href={repo.html_url}
                            className="repo-name"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {repo.name}
                          </a>
                        </Typography>
                        {
                          <Typography color="#999" className="repo-description">
                            {repo.description || "No description"}
                          </Typography>
                        }
                        <br />
                        <div className="flex-center-space-between">
                          <span className="flex-center-center">
                            {repo.language ? (
                              <CircleIcon
                                style={{
                                  color: generateLanguageColor(repo.language),
                                }}
                              />
                            ) : (
                              <div style={{ width: "50px" }} />
                            )}
                            &nbsp;
                            <label style={{ color: "#999" }}>
                              {repo.language}
                            </label>
                          </span>
                          <Typography color="#999">
                            Updated on {formatDate(repo.updated_at)}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography>No repositories</Typography>
                )
              ) : (
                <Skeleton variant="text" width="100%" height="90%" />
              )}
            </Grid>
          </Grid>
        )
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default UserDetails;
