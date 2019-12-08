/* eslint-disable */
const uuidV4 = require("uuid/v1");
import Event from "./models/Event";
const Dict = require("collections/dict");

let state;

function initializeController() {
  // previousEvents = getEventsFromDB('worker_events');
  state = {
    // events: previousEvents,
    employees: [],
    serverMessage: "xx"
    // selectedWorker: null
  };
}

function addEmployee({ commit }, employee) {
  employee.id = uuidV4();
  const eventObj = new Event(uuidV4(), "EMPLOYEE_ADDED", employee);
  
  commit("EMPLOYEE_EVENT_OCCURED", eventObj);
}

function employeeFieldUpdated({ commit }, employee) {
  const eventObj = new Event(uuidV4(), "EMPLOYEE_UPDATED", employee);
  commit("EMPLOYEE_EVENT_OCCURED", eventObj);
}

function EMPLOYEE_EVENT_OCCURED(state, event) {
  switch (event.eventName) {
    case "EMPLOYEE_ADDED":
      // console.warn(event.payload.id);
      // state.employees.add(event.payload, event.payload.id);
      // state.employees.toArray().forEach(x => {
      //   console.warn(x);
      // });
      // this.$emit
      break;
    case "EMPLOYEE_UPDATED":
      state.employees.set(event.payload.id, event.payload);
      break;
    default:
      break;
  }
}

function SOCKET_EmployeeListUpdated(state, employees) {
    console.warn("WTF");
    state.serverMessage = message;
}

function SOCKET_CONNECT(state) {
  console.log("AHHHHHH");
  this.serverMessage = "connect?";
}

function getMessage(state){
  return state.serverMessage;
}

function getAllEmployees(state) {
  return state.employees.toArray();
}
const mutations = {
  EMPLOYEE_EVENT_OCCURED,
  SOCKET_EmployeeListUpdated,
  SOCKET_CONNECT
};

const actions = {
  addEmployee,
  employeeFieldUpdated
};

const getters = {
  getAllEmployees,
  getMessage
};

initializeController();

export default {
  state,
  mutations,
  actions,
  getters
};
