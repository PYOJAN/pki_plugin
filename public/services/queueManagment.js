class Queue {
  #list = [];
  #capacity = null;
  #tail = 0;
  #head = 0;
  constructor(CAPACITY_OF_QUEUE) {
    this.#capacity = Math.max(Number(CAPACITY_OF_QUEUE), 0) || null;

    if (this.#capacity) {
      this.#list = Array.from({ length: this.#capacity });
    }
  }
  // Get size of the queue
  get size() {
    return this.#tail - this.#head;
  }
  // Check if the queue is empty
  get isEmpty() {
    return this.size === 0;
  }
  // Check if the queue is full
  get isFull() {
    return this.#capacity && this.#tail === this.#capacity;
  }

  // reset the queue
  reset() {
    this.#head = 0;
    this.#tail = 0;
    this.#list = [];
  }

  // Add an element to the queue
  enqueue(item) {
    if (!this.isFull) {
      this.#list[this.#tail] = item;
      this.#tail += 1;
    }
    return this.size;
  }

  // Remove an element from the queue
  dequeue() {
    let item = null;
    if (!this.isEmpty) {
      item = this.#list[this.#head];
      delete this.#list[this.#head];
      this.#head += 1;
      if (this.isEmpty) {
        this.#head = 0;
        this.#tail = 0;
      }
    }
    return item;
  }

  // Get the first element in the queue
  peek() {
    if (this.isEmpty) {
      return null;
    }
    return this.#list[this.#head];
  }
  all() {
    return this.#list;
  }
}

module.exports = Queue;
