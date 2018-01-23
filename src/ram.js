/**
 * RAM access
 * @param {number} size - a positive number.
 */
class RAM {
  constructor(size) {
    this.mem = new Array(size);
    this.mem.fill(0);
  }

  /**
   * Write (store) MDR value at address MAR
   */
  write(MAR, MDR) {
    // write the value in the MDR to the address MAR
    this.mem[MAR] = MDR;
  }

  /**
   * Read (load) MDR value from address MAR
   * @param {number} MAR
   * @returns {binary} MDR
   */
  read(MAR) {
    // Read the value in address MAR and return it
    return this.mem[MAR];
  }
}

module.exports = RAM;
