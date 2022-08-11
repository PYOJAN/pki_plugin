const EventEmitter = require("events");

// Emmiter Names
const emmiterNames = {
  error: "ERROR",
  message: "MESSAGE",
  trigger: "TRIGGER"
};

class Transporter extends EventEmitter {
  error(errors) {
    this.emit(emmiterNames.error, errors);
  }

  message(messages) {
    this.emit(emmiterNames.message, messages);
  }
  trigger(message) {
    this.emit(emmiterNames.trigger, message)
  }
}

const Transport = new Transporter();
module.exports = {
  Transport,
  emmiterNames,
};

// myEmitter.on("test", () => console.log("Yay, it works!"));

// myEmitter.foo();
