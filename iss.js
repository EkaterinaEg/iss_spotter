const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const url = "https://api64.ipify.org/?format=json";

const fetchMyIP = function(callback) {
  request(url, (error, response, body) => {
    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const data = JSON.parse(body);
    const { ip } = data;

    callback(null, ip);
  });
};


const query = 'http://ipwho.is/';

const fetchCoordsByIP = function(ip, callback) {
  request(`${query}${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    const data = JSON.parse(body);
    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      callback(Error(message), null);
      return;
    }

    const { latitude, longitude } = data;

    callback(null, { latitude, longitude });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const  { latitude } = coords;
  const  { longitude } = coords;
  // const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`
  // console.log(url);

  request(`https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const data = JSON.parse(body).response;

    
    callback(null, data);
  });
};


const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coord) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coord, (error, passes) => {
        if (error) {
          return callback(error, null);
        }
        callback(null, passes);
      });
    });
  });
};

// module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes  };
module.exports = { nextISSTimesForMyLocation  };