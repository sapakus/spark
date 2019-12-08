const eventChain = require("./index.js");
console.log("ok. Load..");


// wait to connect.
setTimeout(function() {
  eventChain.loadEventByLastHash("you.dont.need.a.blockchain");
}, 2000);
