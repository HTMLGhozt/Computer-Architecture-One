/**
 * LS-8 v2.0 emulator skeleton code
 */

// Instructions
const ADD = 0b00001100; // ADD register register
const CAL = 0b00001111; // CAL register
const CMP = 0b00010110; // CMP register register
const DEC = 0b00011000; // DEC register
const DIV = 0b00001110; // DIV register register
const HLT = 0b00011011; // HLT
const INC = 0b00010111; // INC register
const INT = 0b00011001; // INT register
const IRT = 0b00011010; // IRT
const JEQ = 0b00010011; // JEQ register
const JMP = 0b00010001; // JMP register
const JNE = 0b00010100; // JNE register
const LDI = 0b00000100; // LDI register immediate
const LDS = 0b00010010; // LDS register register
const MUL = 0b00000101; // MUL register register
const NOP = 0b00000000; // NOP
const POP = 0b00001011; // POP register
const PRA = 0b00000111; // PRA register *pseudo-instruction*
const PRN = 0b00000110; // PRN register *pseudo-insctruction*
const PSH = 0b00001010; // PSH register
const RET = 0b00010000; // RET
const STR = 0b00001001; // STR register register
const SUB = 0b00001101; // SUB register register


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
    bt[ADD] = this.ADD;
    // bt[CAL] = this
    bt[CMP] = this.CMP;
    bt[DEC] = this.DEC;
    bt[DIV] = this.DIV;
    bt[HLT] = this.HLT;
    bt[INC] = this.INC;
    // bt[INT] = this
    // bt[IRT] = this
    bt[JEQ] = this.JEQ;
    bt[JMP] = this.JMP;
    bt[JNE] = this.JNE;
    bt[LDI] = this.LDI;
    bt[LDS] = this.LDS;
    bt[MUL] = this.MUL;
    bt[NOP] = this.NOP;
    bt[POP] = this.POP;
    // bt[PRA] = this
    bt[PRN] = this.PRN;
    bt[PSH] = this.PSH;
    // bt[RET] = this
    // bt[STR] = this
    bt[SUB] = this.SUB;
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

  /**
   * ALU functionality
   * @param {string} op can be: ADD CMP DEC DIV INC MUL SUB
   * @param {number} regA - a positive integer between 1 and 5.
   * @param {number} regB - a positive integer between 1 and 5.
   */
  alu(op, regA, regB) {
    switch (op) {
      case 'ADD':
        this.reg[regA] += this.reg[regB] & 0b11111111;
        break;
      case 'CMP':
        this.equal = this.reg[regA] === this.reg[regB];
        break;
      case 'DEC':
        this.reg[regA] -= 1 & 0b11111111;
        break;
      case 'DIV':
        if (this.reg[regB] !== 0) {
          this.reg[regA] /= this.reg[regB];
        }
        break;
      case 'INC':
        this.reg[regA] += 1 & 0b11111111;
        break;
      case 'MUL':
        this.reg[regA] *= this.reg[regB] & 0b11111111;
        break;
      case 'SUB':
        this.reg[regA] -= this.reg[regB] & 0b11111111;
        break;
      default:
        break;
    }
  }

  // INSTRUCTION HANDLER CODE:

  /**
   * ADD R,R
   *
   * Add two registers and store the result in registerA.
   */
  ADD() {
    const [regA, regB] = this.helper(2);
    this.alu('ADD', regA, regB);
  }

  /**
   * CAL R
   *
   * Calls a subroutine (function) at the address
   * stored in the register.
   *
   * Before the call is made, the address of the
   * next instruction that will execute is pushed
   * onto the stack.
   */
  CAL() {}

  /**
   * CMP R,R
   *
   * Compare the value in two registers.
   * If the are equal, set the equal flag to true.
   * If the are not equal, set the equal flag to false.
   */
  CMP() {
    const [regA, regB] = this.helper(2);
    this.alu('CMP', regA, regB);
  }

  /**
   * DEC R
   *
   * Decrement the value in the given register.
   */
  DEC() {
    const [regA] = this.helper(1);
    this.alu('DEC', regA, null);
  }

  /**
   * DIV R,R
   */
  DIV() {
    const [regA, regB] = this.helper(2);
    this.alu('DIV', regA, regB);
  }

  /**
   * HLT
   *
   * Halt the CPU (and exit the emulator).
   */
  HLT() {
    this.stopClock();
  }

  /**
   * INC R
   *
   * Increment the value in the given register.
   */
  INC() {
    const [regA] = this.helper(1);
    this.alu('INC', regA, null);
  }

  /**
   * INT R
   */
  INT() {}

  /**
   * IRT
   */
  IRT() {}

  /**
   * JEQ R
   *
   * If equal flag is set (true), jump to the address
   * stored in the given register.
   */
  JEQ() {
    const [reg] = this.helper(1);
    if (this.equal) {
      this.reg.PC = this.reg[reg];
    }
  }

  /**
   * JMP R
   *
   * Jump to the address stored in the given register.
   */
  JMP() {
    const [reg] = this.helper(1);
    this.reg.PC = this.reg[reg];
  }

  /**
   * JNE R
   */
  JNE() {
    const [reg] = this.helper(1);
    if (!this.equal) {
      this.reg.PC = this.reg[reg];
    }
  }

  /**
   * LDI R,I
   *
   * Set the value of a register.
   */
  LDI() {
    const [reg, val] = this.helper(2);
    this.reg[reg] = val;
  }

  /**
   * LDS R,R
   *
   * Loads registerA with the value at the address
   * stored in registerB.
   */
  LDS() {
    const [reg, val] = this.helper(2);
    this.reg[reg] = this.reg[val];
  }

  /**
   * MUL R,R
   *
   * Multiply two registers together and store the result
   * in registerA.
   */
  MUL() {
    const [regA, regB] = this.helper(2);
    this.alu('MUL', regA, regB);
  }

  /**
   * NOP
   *
   * No operation. Continues to the next line.
   */
  NOP() {
    this.reg.PC += 1;
  }

  /**
   * POP R
   *
   * Pop the value at the top of the stack into the given
   * register
   */
  POP() {
    const [reg] = this.helper(1);
    this.reg[reg] = this.ram.read(this.reg[7]);
    this.reg[7] += 1;
  }

  /**
   * PRA R
   *
   * Print alpha character value stored in the given register.
   */
  PRA() {}

  /**
   * PRN R
   *
   * Print numeric value stored in the given register.
   */
  PRN() {
    const [reg] = this.helper(1);
    console.info(this.reg[reg]);
  }

  /**
   * PSH R
   *
   * Push the given register on the stack.
   */
  PSH() {
    const [reg] = this.helper(1);
    this.reg[7] -= 1;
    this.poke(this.reg[7], this.reg[reg]);
  }

  /**
   * RET
   *
   * Return from subroutine.
   * Pop the value from the top of the stack and
   * store it in the PC.
   */
  RET() {}

  /**
   * STR R,R
   *
   * Store value in registerB in the address stored
   * in registerA.
   */
  STR() {}

  /**
   * SUB R R
   *
   * Subtract the value in the second register from the
   * first, storing the result in registerA.
   */
  SUB() {
    const [regA, regB] = this.helper(2);
    this.alu('SUB', regA, regB);
  }
}

module.exports = CPU;
