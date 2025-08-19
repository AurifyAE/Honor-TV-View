import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";

const SpotRate = () => {
  const { goldData, silverData } = useSpotRate();

  const getBackgroundColor = (change) => {
    if (change === "up") {
      return "green"; // Green color for increase
    } else if (change === "down") {
      return "red"; // Red color for decrease
    }
    return ""; // White color for no change
  };

  const getColor = (change) => {
    if (change === "up") {
      return "white"; // Green color for increase
    } else if (change === "down") {
      return "white"; // Red color for decrease
    }
    return "white"; // Default color for no change
  };

  const renderSpotSection = (metal, data) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1vw",
      }}
    >
      {/* Spot rate section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          width: "100%",
          backgroundColor: "transparent",
          border: "3px solid #AF6F2A",
          borderRadius: "15px",
        }}
      >
        <Box
          className="flex flex-row items-center justify-center rounded-l-xl"
          sx={{
            backgroundColor: "#C89F58",
            width: "200px",
          }}
        >
          <Typography
            sx={{
              fontSize: "2vw",
              fontWeight: "600",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            {metal}
          </Typography>
          <Typography
            sx={{
              marginTop: "10px",
              fontSize: "1.5vw",
              color: "white",
              fontWeight: "600",
            }}
          >
            oz
          </Typography>
        </Box>
        <Box className="flex flex-row items-center justify-between p-1 w-full bg-[#05463E] rounded-r-xl">
          <Box className="flex flex-col items-center justify-between w-full">
            <Box className="flex flex-row items-center justify-center">
              <Typography
                sx={{
                  fontSize: "1.4vw",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                BID
              </Typography>
              <Box
                className="flex justify-center items-center"
                sx={{
                  marginLeft: "0.3vw",
                  backgroundColor: "#CFA545",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  fontSize: "1.1vw",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                $
              </Box>
            </Box>
            <Typography
              variant="h3"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "2.5vw",
                fontWeight: "bold",
                margin: "0.2vw 0",
                padding: "0.4vw 0",
                borderRadius: "5px",
                color: getColor(data.bidChanged),
                backgroundColor: getBackgroundColor(data.bidChanged),
                width: "11vw",
              }}
            >
              {data.bid}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "red",
                borderRadius: "3px",
                width: "11vw",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "1.1vw",
                  color: "white",
                  fontWeight: "bold",
                  marginLeft: "0.5vw",
                }}
              >
                LOW {data.low}
              </Typography>
            </Box>
          </Box>
          {/* ASK section - identical structure to BID section */}
          <Box className="flex flex-col items-center justify-between w-full">
            <Box className="flex flex-row items-center justify-center">
              <Typography
                sx={{
                  fontSize: "1.4vw",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                ASK
              </Typography>
              <Box
                className="flex justify-center items-center"
                sx={{
                  marginLeft: "0.3vw",
                  backgroundColor: "#CFA545",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  fontSize: "1.1vw",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                $
              </Box>
            </Box>
            <Typography
              variant="h3"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "2.5vw",
                fontWeight: "bold",
                margin: "0.2vw 0",
                padding: "0.4vw 0",
                borderRadius: "5px",
                color: getColor(data.bidChanged),
                backgroundColor: getBackgroundColor(data.bidChanged),
                width: "11vw",
              }}
            >
              {data.ask}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "green",
                borderRadius: "3px",
                width: "11vw",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "1.1vw",
                  color: "white",
                  fontWeight: "bold",
                  marginLeft: "0.5vw",
                }}
              >
                HIGH {data.high}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      className="mx-auto rounded-lg mt-4"
      sx={{
        maxWidth: "100%",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1vw" }}>
        {renderSpotSection("gold", goldData)}
        {renderSpotSection("silver", silverData)}
      </Box>
    </Box>
  );
};

export default SpotRate;
