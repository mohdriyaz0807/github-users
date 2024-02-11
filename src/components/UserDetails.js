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
import GitHubIcon from "@mui/icons-material/GitHub";
import BusinessIcon from "@mui/icons-material/Business";
import XIcon from "@mui/icons-material/X";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PlaceIcon from "@mui/icons-material/Place";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import CircleIcon from "@mui/icons-material/Circle";
import styled from "@emotion/styled";
import NoResultsFound from "./NoResultsFound";
import { ArrowBack } from "@mui/icons-material";

const StyledH1 = styled.h1`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  margin-top: 0;
  background-color: #ededed;
`;

const StyledTypography = styled(Typography)`
  display: flex;
  align-items: start;
  margin: 10px 0;
`;

const StyledBackButton = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  padding: 20px;
  background-color: #ededed;
  cursor: pointer;
`;

const UserDetails = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
      <StyledBackButton onClick={() => (window.location.href = "/")}>
        <ArrowBack />
        &nbsp;<b>Back</b>
      </StyledBackButton>
      <StyledH1>
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
      </StyledH1>
      {!loading ? (
        error ? (
          <NoResultsFound />
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
                  <StyledTypography variant="body1">
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
                  </StyledTypography>
                ) : null}
                <StyledTypography variant="body1">
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
                </StyledTypography>
                {user.location ? (
                  <StyledTypography variant="body1">
                    <PlaceIcon />
                    &nbsp;&nbsp;{user.location}
                  </StyledTypography>
                ) : null}
                {user.email ? (
                  <StyledTypography variant="body1">
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
                  </StyledTypography>
                ) : null}
                {user.blog ? (
                  <StyledTypography variant="body1">
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
                  </StyledTypography>
                ) : null}
                {user.twitter ? (
                  <StyledTypography variant="body1">
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
                  </StyledTypography>
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
                <div className="repo-container">
                  {repos.length ? (
                    repos.map((repo, index) => (
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
                    ))
                  ) : (
                    <Typography>No repositories</Typography>
                  )}
                </div>
              ) : (
                <div className="repo-container">
                  {Array.from({ length: 30 }).map((_, index) => (
                    <div key={index} className="repo-item">
                      <Skeleton
                        style={{ borderRadius: "10px" }}
                        variant="rectangular"
                        height={120}
                      />
                    </div>
                  ))}
                </div>
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
