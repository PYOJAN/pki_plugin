const EventEmitter = require('events');

class Transorter extends EventEmitter {
  ready() {
    this.emit('DONE');
  }
}

module.exports = new Transorter();