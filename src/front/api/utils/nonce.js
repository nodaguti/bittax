export default class Nonce {
  last = 0;

  constructor(start = 0) {
    this.last = start;
  }

  next() {
    let nonce = 100 * Date.now();

    while (true) {
      if (nonce !== this.last) {
        break;
      }

      nonce += 1;
    }

    this.last = nonce;

    return nonce;
  }
}
