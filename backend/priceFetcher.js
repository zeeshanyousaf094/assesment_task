const axios = require("axios");

const fetchPrices = async () => {
  try {
    const ethResponse = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const ethPrice = ethResponse.data.ethereum?.usd;

    const maticResponse = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd"
    );
    const maticPrice = maticResponse.data["matic-network"]?.usd;

    if (ethPrice !== undefined && maticPrice !== undefined) {
      return { ethPrice, maticPrice };
    } else {
      console.error("Price data not found for Ethereum or Polygon");
    }
  } catch (error) {
    console.error("Error fetching prices:", error.message);
    if (error.response) {
      console.error("API Response:", error.response.data);
    }
  }
};

module.exports = fetchPrices;
