const eventChain = require("./index.js");
console.log("Dont Trust, Verify.");

// wait to connect.
setTimeout(function() {
  eventChain.verifyHistory();
}, 2000);
