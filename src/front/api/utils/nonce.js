export default class Nonce {
  current = 0;

  constructor(start = 0) {
    this.current = start;
  }

  next() {
    this.current += 1;
    return this.current;
  }
}
