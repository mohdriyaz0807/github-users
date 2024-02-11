import React from "react";
import { Typography } from "@mui/material";
import NoresultsPng from "../assets/no-results.png";
import styled from "@emotion/styled";

const StyledNoResultsDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 20;
`;

const NoResultsFound = () => {
  return (
    <StyledNoResultsDiv>
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
    </StyledNoResultsDiv>
  );
};

export default NoResultsFound;
