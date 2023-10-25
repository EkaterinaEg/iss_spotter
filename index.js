const { nextISSTimesForMyLocation } = require("./iss");

// index.js

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log("It worked! Returned IP:", ip);
// });

// fetchCoordsByIP('173.35.162.88', (error, coordinates) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned coordinates:' , coordinates);
// });

// const coordinates = { latitude: '44.3893556', longitude: '-79.6903316' };

// fetchISSFlyOverTimes(coordinates, (error, data) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned flyover times:' , data);
// });

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }
 

  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
});