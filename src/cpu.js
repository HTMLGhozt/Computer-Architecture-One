/**
 * LS-8 v2.0 emulator skeleton code
 */

const fs = require('fs');

// Instructions

const HLT = 0b00011011; // Halt CPU
// !!! IMPLEMENT ME
const LDI = 0b00000100; // LDI
const MUL = 0b00000101; // MUL
const PRN = 0b00000110; // PRN

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers
        
        // Special-purpose registers
        this.reg.PC = 0; // Program Counter
        this.reg.IR = 0; // Instruction Register

		this.setupBranchTable();
    }
	
	/**
	 * Sets up the branch table
	 */
	setupBranchTable() {
		const bt = {}
        bt[HLT] = this.HLT;
        // !!! IMPLEMENT ME            
        bt[LDI] = this.LDI; // LDI
        bt[MUL] = this.MUL; // MUL
        bt[PRN] = this.PRN; // PRN
        this.branchTable = bt;
	}

    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        const _this = this;

        this.clock = setInterval(() => {
            _this.tick();
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
     * 
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT ME
                this.reg[regA] *= this.reg[regB] & 0b11111111;
                break;
            case 'ADD':
            case 'SUB':
            case 'DIV':
            case 'INC':
            case 'DEC':
            case 'CMP':
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // !!! IMPLEMENT ME
        // Load the instruction register from the current PC
        this.reg.IR = this.ram.read(this.reg.PC);

        // console.log(`${this.reg.PC}: ${this.reg.IR.toString(2)}`); // Debugging output

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
        // !!! IMPLEMENT ME
        this.stopClock();
        return;
    }

    /**
     * LDI R,I
     */
    LDI() {
        // !!! IMPLEMENT ME
        const [reg, val] = this.HELP(2);
        this.reg[reg] = val;
    }
    HELP(n) {
        const arr = [];
        for (let i = 0; i < n; i++) {
            arr.push(this.ram.read(++this.reg.PC));
        }
        this.reg.PC++
        return arr;
    }
    /**
     * MUL R,R
     */
    MUL() {
        // !!! IMPLEMENT ME
        const [regA, regB] = this.HELP(2);

        this.alu('MUL', regA, regB);
    }

    /**
     * PRN R
     */
    PRN() {
        // !!! IMPLEMENT ME
        const [reg] = this.HELP(1);
        console.log(this.reg[reg]);
    }
}

module.exports = CPU;
