const AppSettings = require("./appSettings");
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var lightning = require("./lightning");
var eventChain = require("./eventChain");

const PORT = AppSettings.PORT;

//TODO: probably lock this down.
io.set("origins", "*:*"); 

const broadcast = (err, to, msg) => {
  if (err) {
    return;
  }
  // console.log(msg);
  // console.log(msg.subject);
  io.emit(`yo_${to}`, msg);
};

const handleRequests = msg => {
  console.warn(msg);


  if (!!msg.subject) {
    if (msg.subject.indexOf("Lightning") >= 0) {
      lightning.handleRequests(msg, broadcast);
    } else if (
      msg.subject.lastIndexOf("Upsert", 0) === 0 ||
      msg.subject.lastIndexOf("Get", 0) === 0
    ) {
      eventChain.handleRequest(msg, broadcast);
    } else {
      switch (msg.subject) {
        case "PING!":
          io.emit("messageChannel", "PONG!");
          break;
        default:
          break;
      }
    }
  }
};

const onConnection = socket => {
  socket.on("yo_sofpear", handleRequests);
};

/**
 *
 * Server Starts here:
 */

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

app.get("/", function(req, res) {
  res.send("hello world");
});

io.on("connection", onConnection);



/**
 *
 * Message Protocol:
 *
 * subject: string,
 * payload: object.
 * from: string,
 *
 */
