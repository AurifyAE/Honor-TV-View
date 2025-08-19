import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, useMediaQuery } from "@mui/material";
import LimitExceededModal from "../components/LimitExceededModal";
import SpotRate from "../components/SpotRate";
import CommodityTable from "../components/CommodityTable";
import NewsTicker from "../components/News";
import TradingViewWidget from "../components/TradingViewWidget";
import Carousel from "../components/Carousel";
import HonorLogo from "../assets/HonorLogo.png";
import {
  fetchSpotRates,
  fetchServerURL,
  fetchNews,
  fetchTVScreenData,
} from "../api/api";
import io from "socket.io-client";
import { useSpotRate } from "../context/SpotRateContext";

function TvScreen() {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [serverURL, setServerURL] = useState("");
  const [news, setNews] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [goldBidSpread, setGoldBidSpread] = useState("");
  const [goldAskSpread, setGoldAskSpread] = useState("");
  const [silverBidSpread, setSilverBidSpread] = useState("");
  const [silverAskSpread, setSilverAskSpread] = useState("");
  const [symbols, setSymbols] = useState(["GOLD", "SILVER"]);
  const [error, setError] = useState(null);

  const { updateMarketData } = useSpotRate();

  const adminId = import.meta.env.VITE_APP_ADMIN_ID;

  updateMarketData(
    marketData,
    goldBidSpread,
    goldAskSpread,
    silverBidSpread,
    silverAskSpread
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotRatesRes, serverURLRes, newsRes] = await Promise.all([
          fetchSpotRates(adminId),
          fetchServerURL(),
          fetchNews(adminId),
        ]);

        // Handle Spot Rates
        const {
          commodities,
          goldBidSpread,
          goldAskSpread,
          silverBidSpread,
          silverAskSpread,
        } = spotRatesRes.data.info;
        setCommodities(commodities);
        setGoldBidSpread(goldBidSpread);
        setGoldAskSpread(goldAskSpread);
        setSilverBidSpread(silverBidSpread);
        setSilverAskSpread(silverAskSpread);

        // Handle Server URL
        const { serverURL } = serverURLRes.data.info;
        setServerURL(serverURL);

        // Handle News
        setNews(newsRes.data.news.news);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      }
    };

    fetchData();

    // Fetch TV screen data (you can leave this as a separate call)
    fetchTVScreenData(adminId)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          // Allow TV screen view
          setShowLimitModal(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setShowLimitModal(true); // Show the modal on 403 status
        } else {
          console.error("Error:", error.message);
          alert("An unexpected error occurred.");
        }
      });
  }, [adminId]);

  // Function to Fetch Market Data Using Socket
  useEffect(() => {
    if (serverURL) {
      const socket = io(serverURL, {
        query: { secret: import.meta.env.VITE_APP_SOCKET_SECRET_KEY },
        transports: ["websocket"],
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("Connected to WebSocket server");
        socket.emit("request-data", symbols);
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      socket.on("market-data", (data) => {
        if (data && data.symbol) {
          setMarketData((prevData) => ({
            ...prevData,
            [data.symbol]: {
              ...prevData[data.symbol],
              ...data,
              bidChanged:
                prevData[data.symbol] && data.bid !== prevData[data.symbol].bid
                  ? data.bid > prevData[data.symbol].bid
                    ? "up"
                    : "down"
                  : null,
            },
          }));
        } else {
          console.warn("Received malformed market data:", data);
        }
      });

      socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        setError("An error occurred while receiving data");
      });

      // Cleanup function to disconnect the socket
      return () => {
        socket.disconnect();
      };
    }
  }, [serverURL, symbols]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getFormattedDateParts = (date) => {
    const options = {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    };

    const day = date.toLocaleDateString("en-GB", { weekday: "long" });
    const dayOfMonth = date.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = date
      .toLocaleDateString("en-GB", { month: "long" })
      .toUpperCase();
    const year = date.toLocaleDateString("en-GB", { year: "numeric" });

    return {
      day,
      date: dayOfMonth,
      month,
      year,
    };
  };

  const getFormattedTimeWithoutSeconds = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentDate = new Date();
  const { day, date, month, year } = getFormattedDateParts(currentDate);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      <Box className="flex flex-row justify-between items-center">
        <Box>
          <img src={HonorLogo} alt="" className="w-[500px] h-32" />
        </Box>
        <div className="flex flex-col items-center justify-center text-center text-[#FDE182]">
          {/* Time Display */}
          <div
            className="font-bold mb-2"
            style={{
              fontSize: "clamp(3rem, 2vw, 7rem)",
              fontFamily:
                '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
              letterSpacing: "0px",
              lineHeight: 0.9,
              textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            {getFormattedTimeWithoutSeconds(dateTime)}
          </div>

          {/* Day */}
          <div>
            <div
              className="font-medium text-[#FDE182]"
              style={{
                fontSize: "clamp(2rem, 2vw, 1.3rem)",
                letterSpacing: "10px",
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {day.toUpperCase()}
            </div>
          </div>

          {/* Date Row */}
          <div className="flex gap-6 mb-2 text-[#FDE182]">
            {[date, month, year].map((item, index) => (
              <div key={index}>
                <div
                  className="font-semibold"
                  style={{
                    fontSize: "clamp(1.8rem, 1.5vw, 5rem)",
                    letterSpacing: "0.5px",
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Box>
      {/* Grid */}
      <Grid
        container
        spacing={6}
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        {/* Side: SpotRate */}
        <Grid item xs={12} md={5}>
          {/* SpotRate Component */}
          <SpotRate />

          {/* TradingViewWidget */}
          {/* <TradingViewWidget /> */}

          {/* Carousel */}
          {/* <Carousel /> */}

          <Box className="flex flex-col justify-center items-center">
            <Typography sx={{ fontSize: "1.2vw", marginTop: "20px" }}>
              Powered by www.aurify.ae
            </Typography>
          </Box>
        </Grid>

        {/* Side: Commodity Table */}
        {/* Logo & Date */}
        <Grid item xs={12} md={7}>
          {/* Commodity Table */}
          <CommodityTable commodities={commodities} />
        </Grid>
      </Grid>

      {/* News Component */}
      <NewsTicker newsItems={news} />

      {/* Conditional rendering of the modal */}
      {showLimitModal && <LimitExceededModal />}
    </Box>
  );
}

export default TvScreen;
