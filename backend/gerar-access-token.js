const axios = require("axios");

const CLIENT_ID = "1859299942877011";
const CLIENT_SECRET = "oqBOKg2dscF1b1q1yTS8bK0MhmCFcShd";
const REFRESH_TOKEN = "TG-69d583cc2b95940001ffa3db-2929638654";

async function renovarToken() {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("refresh_token", REFRESH_TOKEN);

    const response = await axios.post(
      "https://api.mercadolibre.com/oauth/token",
      params,
      {
        headers: {
          "accept": "application/json",
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("STATUS:", response.status);
    console.log("DADOS:", response.data);
  } catch (error) {
    if (error.response) {
      console.log("STATUS:", error.response.status);
      console.log("DADOS:", error.response.data);
    } else {
      console.log("ERRO:", error.message);
    }
  }
}

renovarToken();