import React from "react";
import { Box, Typography } from "@mui/material";

const NewsTicker = ({ newsItems }) => {
  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: "50px",
        marginTop: "25px",
        border: "3px solid #AF6F2A",
        borderRadius: "10px",
      }}
    >
      <Box
        className="flex flex-col justify-center items-center rounded-l-lg"
        sx={{
          backgroundColor: "#C89F58",
          color: "white",
          width: "200px",
          height: "100%",
        }}
      >
        <Typography
          sx={{ fontSize: "1.5vw", fontWeight: "bold", padding: "0px" }}
        >
          HONOR
        </Typography>
        <Typography
          sx={{
            fontSize: "1vw",
            fontWeight: "bold",
            padding: "0px",
            marginTop: "-10px",
          }}
        >
          Latest News
        </Typography>
      </Box>

      <Box
        className="rounded-r-lg"
        sx={{
          width: "100%",
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
          backgroundColor: "#C0D4D3",
          height: "100%",
          opacity: "80%",
        }}
      >
        <Box
          component="div"
          sx={{
            display: "inline-block",
            animation: "scroll 60s linear infinite",
            color: "black",
            fontSize: "2vw",
            textAlign: "center",
          }}
        >
          {newsItems.map((item, index) => (
            <Typography
              key={index}
              component="span"
              sx={{
                marginRight: "4vw",
                display: "inline-block",
                color: "black",
                fontSize: "2vw",
              }}
            >
              {item.description}
            </Typography>
          ))}
        </Box>
        <style>
          {`
            @keyframes scroll {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}
        </style>
      </Box>
    </Box>
  );
};

export default NewsTicker;
