import React, {useState, useEffect} from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { useSpotRate } from "../context/SpotRateContext";
import { fetchCurrencyData } from "../api/api";

const CommodityTable = ({ commodities }) => {
  const { goldData, silverData } = useSpotRate();
  const [qatarRate, setQatarRate] = useState(null);

  // Helper function to get bid and ask values based on metal type
  const getBidAskValues = (metal) => {
    if (
      metal === "gold" ||
      metal === "gold kilobar" ||
      metal === "gold ten tola"
    ) {
      return {
        bid: parseFloat(goldData.bid) || 0,
        ask: parseFloat(goldData.ask) || 0,
      };
    } else if (metal === "silver") {
      return {
        bid: parseFloat(silverData.bid) || 0,
        ask: parseFloat(silverData.ask) || 0,
      };
    }
    return { bid: 0, ask: 0 };
  };

  useEffect(() => {
    const getRate = async () => {
      try {
        const data = await fetchCurrencyData();
        setQatarRate(data?.rates?.QAR || null);
        console.log(data?.rates?.QAR )
      } catch (error) {
        console.error("Error fetching currency data:", error);
      }
    };

    getRate();
  }, []);

  // Helper function to calculate purity power
  const calculatePurityPower = (purityInput) => {
    if (!purityInput || isNaN(purityInput)) return 1;
    return purityInput / Math.pow(10, purityInput.toString().length);
  };

  // Helper function to conditionally round values
  const formatValue = (value, weight) => {
    return weight === "GM" ? value.toFixed(2) : Math.round(value);
  };

  // Helper function to get the correct metal name
  const getMetalName = (metal) => {
    switch (metal.toLowerCase()) {
      case "gold":
        return "GOLD";
      case "gold kilobar":
        return "KILO BAR";
      case "gold ten tola":
        return "TEN TOLA BAR";
      default:
        return metal.charAt(0).toUpperCase() + metal.slice(1);
    }
  };

  return (
    <TableContainer
      sx={{
        backgroundColor: "",
        marginTop: "15px",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#C89F58",
              "& th": {
                borderBottom: "none",
              },
              "& th:first-of-type": {
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
              },
              "& th:last-of-type": {
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              },
            }}
          >
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5vw",
                textAlign: "center",
              }}
              colSpan={2}
            >
              COMMODITY
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "2vw",
                textAlign: "center",
              }}
            >
              UNIT
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "2vw",
                textAlign: "center",
              }}
            >
              BID (AED)
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "2vw",
                textAlign: "center",
              }}
            >
              ASK (AED)
            </TableCell>
          </TableRow>
          <Box sx={{ height: "5px" }} />
        </TableHead>
        <Box sx={{ height: "8px" }}></Box>
        <TableBody>
          {commodities.map((commodity, index) => {
            const { bid, ask } = getBidAskValues(commodity.metal.toLowerCase());
            const {
              unit,
              weight,
              buyCharge,
              sellCharge,
              buyPremium,
              sellPremium,
              purity,
            } = commodity;

            // Ensure all values are numbers
            const unitMultiplier =
              {
                GM: 1,
                KG: 1000,
                TTB: 116.64,
                TOLA: 11.664,
                OZ: 31.1034768,
              }[weight] || 1;

            const weightValue = parseFloat(weight) || 0;
            const purityValue = parseFloat(purity) || 0;
            const purityPower = calculatePurityPower(purityValue);
            const buyChargeValue = parseFloat(buyCharge) || 0;
            const sellChargeValue = parseFloat(sellCharge) || 0;
            const buyPremiumValue = parseFloat(buyPremium) || 0;
            const sellPremiumValue = parseFloat(sellPremium) || 0;

            const biddingValue = bid + buyPremiumValue;
            const askingValue = ask + sellPremiumValue;
            const biddingPrice = (biddingValue / 31.103) * 3.64;
            const askingPrice = (askingValue / 31.103) * 3.64;

            // Calculation of buyPrice and sellPrice
            const buyPrice =
              biddingPrice * unitMultiplier * unit * purityPower +
              buyChargeValue;
            const sellPrice =
              askingPrice * unitMultiplier * unit * purityPower +
              sellChargeValue;

            return (
              <React.Fragment key={index}>
                <TableRow
                  sx={{
                    "& td": {
                      borderBottom: "none",
                    },
                    "& td:first-of-type": {
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    },
                    "& td:last-of-type": {
                      borderTopRightRadius: "10px",
                      borderBottomRightRadius: "10px",
                    },
                    backgroundColor: "#C0D4D3",
                    opacity: "70%",
                  }}
                >
                  <TableCell
                    sx={{
                      color: "black",
                      fontSize: "2vw",
                      fontWeight: "bold",
                      textAlign: "right",
                      padding: "8px",
                    }}
                  >
                    {getMetalName(commodity.metal)} {" "}
                    <span className="text-md">
                      {commodity.metal === "Gold Ten TOLA" ? " " : purity}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      fontSize: "1.5vw",
                      textAlign: "left",
                      paddingLeft: "0px",
                      fontWeight: "600",
                      padding: "20px 4px",
                    }}
                  >
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      fontSize: "2vw",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "8px",
                    }}
                  >
                    {unit} {weight}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      fontSize: "2vw",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "8px",
                    }}
                  >
                    {formatValue(buyPrice, weight)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      fontSize: "2vw",
                      fontWeight: "600",
                      textAlign: "center",
                      padding: "0px 10px",
                    }}
                  >
                    {formatValue(sellPrice, weight)}
                  </TableCell>
                </TableRow>
                <Box height={13}></Box>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommodityTable;
