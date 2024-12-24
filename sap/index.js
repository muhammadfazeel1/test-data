const axios = require("axios");
const qs = require("qs"); // To format data as application/x-www-form-urlencoded
const xml2js = require('xml2js'); // For XML to JSON conversion

// OAuth credentials
const client_id = "cpi_ga_sf_d1";
const client_secret = "T>@Sr8C*MJ~zh/Zd";
const token_url =
  "https://oauthasservices-hjadupw5k7.sa1.hana.ondemand.com/oauth2/api/v1/token"; // Token endpoint
const api_url =
  "https://e650161-iflmap.hcisbt.sa1.hana.ondemand.com/http/GA_Portal/TXRN48Y3CB"; // API endpoint

// Payload for the API POST request
const payload =null

// Function to get the OAuth token
async function getOAuthToken() {
  try {
    // Encode the client credentials as Base64 (same as Postman Authorization: Basic)
    const basicAuth = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64"
    );

    // Request token using application/x-www-form-urlencoded
    const response = await axios.post(
      token_url,
      qs.stringify({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`, // Adding the Basic auth header
        },
      }
    );

    const token = response.data.access_token;
    console.log("Token received:", token);
    return token;
  } catch (error) {
    console.error(
      "Error fetching OAuth token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get OAuth token");
  }
}

async function callApiWithToken() {
    try {
        const token = await getOAuthToken();

        // Call the API with the token in headers and send the payload
        const response = await axios.post(api_url, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // Modify if the API expects a different content type
            }
        });
        // console.log('JSON Response:', response.data.root.Employee)

        // Parse the XML response into JSON
        const xmlResponse = response.data.root.Employee;
        xmlResponse.forEach((obj) => {
            let hasNonString = false;
          
            for (const key in obj) {
              if (typeof obj[key] !== 'string') {
                console.log(`Non-string value found in key: ${key} of object:`, obj);
                hasNonString = true;
                break; // Stop further checking for this object once a non-string is found
              }
            }
          
            // if (!hasNonString) {
            //   console.log('All values are strings in this object:', obj);
            // }
          });
        // const parser = new xml2js.Parser();
        // parser.parseString(xmlResponse, (err, result) => {
        //     if (err) {
        //         console.error('Error parsing XML:', err);
        //         return;
        //     }
        //     // JSON result from XML response
        //     console.log('JSON Response:', result.root);
        // });

        return response.data;
    } catch (error) {
        console.error('Error calling API:', error.response?.data || error.message);
        throw new Error('Failed to call API');
    }
}

// Trigger the functions
callApiWithToken();
