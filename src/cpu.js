/**
 * LS-8 v2.0 emulator skeleton code
*/

// const fs = require('fs');

// Instructions
const HLT = 0b00011011; // HLT
const LDI = 0b00000100; // LDI register immediate
const MUL = 0b00000101; // MUL registerA registerB
const PRN = 0b00000110; // PRN register *pseudo-insctruction*
const PSH = 0b00001010; // PSH register
const POP = 0b00001011; // POP register
const NOP = 0b00000000; // NOP

/**
 * Class for simulating a simple Computer (CPU & memory)
*/
class CPU {
  /**
   * Initialize the CPU
    */
  constructor(ram) {
    this.ram = ram;
    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
    this.reg[7] = 0xF8; // Stack Pointer (SP)

    // Special-purpose registers
    this.reg.PC = 0; // Program Counter
    this.reg.IR = 0; // Instruction Register

    this.setupBranchTable();
  }

  /**
   * Sets up the branch table
   */
  setupBranchTable() {
    const bt = {};
    bt[HLT] = this.HLT;
    bt[LDI] = this.LDI;
    bt[MUL] = this.MUL;
    bt[PRN] = this.PRN;
    bt[PSH] = this.PSH;
    bt[POP] = this.POP;
    bt[NOP] = this.alu;
    this.branchTable = bt;
  }

  /**
   * Store value in memory address, useful for program loading
    */
  poke(address, value) {
    this.ram.write(address, value);
  }
  /**
   * a helper function that increments the Program Counter (PC)
    * and returns the instructions loaded in ram.
    * @param {number} n - a positive number.
    */
  helper(n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      this.reg.PC += 1;
      arr.push(this.ram.read(this.reg.PC));
    }
    this.reg.PC += 1;
    return arr;
  }
  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1);
  }

  /**
   * Stops the clock
    */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
    * @param {string} op can be: ADD SUB MUL DIV INC DEC CMP
    * @param {number} regA - a positive integer between 1 and 5.
    * @param {number} regB - a positive integer between 1 and 5.
    */
  alu(op = 'NOP', regA, regB) {
    switch (op) {
      case 'MUL':
        this.reg[regA] *= this.reg[regB] & 0b11111111;
        break;
      case 'ADD':
        this.reg[regA] += this.reg[regB] & 0b11111111;
        break;
      case 'SUB':
        this.reg[regA] -= this.reg[regB] & 0b11111111;
        break;
      case 'DIV':
        break;
      case 'INC':
        this.reg[regA] += 1 & 0b11111111;
        break;
      case 'DEC':
        this.reg[regA] -= 1 & 0b11111111;
        break;
      case 'CMP':
        break;
      case 'NOP':
      default:
        this.reg.IP += 1 & 0b00000110;
        break;
    }
  }

  /**
   * Advances the CPU one cycle
    */
  tick() {
    // Load the instruction register from the current PC
    this.reg.IR = this.ram.read(this.reg.PC);

    // console.info(`${this.reg.PC}: ${this.reg.IR.toString(2)}`); // Debugging output

    // Based on the value in the Instruction Register, jump to the
    // appropriate hander in the branchTable
    const handler = this.branchTable[this.reg.IR];
    // Check that the handler is defined, halt if not (invalid
    // instruction)
    if (handler === undefined) this.branchTable[HLT].call(this);
    // We need to use call() so we can set the "this" value inside
    // the handler (otherwise it will be undefined in the handler)
    else handler.call(this);
  }

  // INSTRUCTION HANDLER CODE:

  /**
   * HLT
    */
  HLT() {
    this.stopClock();
  }

  /**
   * LDI R,I
    */
  LDI() {
    const [reg, val] = this.helper(2);
    this.reg[reg] = val;
  }

  /**
   * MUL R,R
    */
  MUL() {
    const [regA, regB] = this.helper(2);
    this.alu('MUL', regA, regB);
  }

  /**
   * PRN R
    */
  PRN() {
    const [reg] = this.helper(1);
    console.info(this.reg[reg]);
  }

  /**
   * PSH R
    */
  PSH() {
    const [reg] = this.helper(1);
    this.reg[7] -= 1;
    this.poke(this.reg[7], this.reg[reg]);
  }

  /**
   * POP R
    */
  POP() {
    const [reg] = this.helper(1);
    this.reg[reg] = this.ram.read(this.reg[7]);
    this.reg[7] += 1;
  }
}

module.exports = CPU;
