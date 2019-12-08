const moment = require("moment");
class Event {
  constructor(id, eventName, payload) {
    this.id = id;
    this.eventName = eventName;
    this.payload = payload;
    this.createdTime = moment().format("LLLL");
    this.previousEventHash = "";
  }
}

export default Event;
