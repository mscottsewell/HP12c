/**
 * Tests for HP12c Calculator Memory Arithmetic Operations
 * Verifies STO+, STO-, STO×, STO÷, RCL+, RCL-, RCL×, RCL÷
 */

describe('Memory Arithmetic Operations', () => {
    let calc;
    
    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});

        // Stub minimal browser environment
        global.window = {};
        global.localStorage = {
            getItem: () => null,
            setItem: () => {},
        };
        const stubEl = {
            textContent: '',
            innerHTML: '',
            style: {},
            classList: { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false },
            setAttribute: () => {},
            getAttribute: () => null,
            querySelectorAll: () => [],
            querySelector: () => null,
            appendChild: () => {},
            remove: () => {},
        };
        global.document = {
            addEventListener: (name, handler) => { if (name === 'DOMContentLoaded') handler(); },
            querySelectorAll: () => [],
            getElementById: () => stubEl,
            createElement: () => ({ ...stubEl }),
        };

        // Load calculator
        require('./calculator.js');
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
    
    beforeEach(() => {
        calc = window.calculator;
        calc.memory = {}; // Clear memory
    });
    
    describe('STO+ (Store Add)', () => {
        test('STO+ adds X to memory register', () => {
            // Store 10 in R1
            calc.setX(10);
            calc.store(1);
            expect(calc.memory[1]).toBe(10);
            
            // Add 5 to R1 using STO+ 1
            calc.setX(5);
            calc.storeArithmetic(1, 'add');
            expect(calc.memory[1]).toBe(15);
            expect(calc.getX()).toBe(5); // X unchanged
        });
        
        test('STO+ works with empty register (treats as 0)', () => {
            calc.setX(7);
            calc.storeArithmetic(2, 'add');
            expect(calc.memory[2]).toBe(7);
        });
        
        test('STO+ terminates number entry', () => {
            calc.setX(3);
            calc.isTyping = true;
            calc.storeArithmetic(1, 'add');
            expect(calc.isTyping).toBe(false);
            expect(calc.isNewNumber).toBe(true);
        });
    });
    
    describe('STO- (Store Subtract)', () => {
        test('STO- subtracts X from memory register', () => {
            // Store 20 in R1
            calc.setX(20);
            calc.store(1);
            
            // Subtract 8 from R1 using STO- 1
            calc.setX(8);
            calc.storeArithmetic(1, 'subtract');
            expect(calc.memory[1]).toBe(12);
            expect(calc.getX()).toBe(8); // X unchanged
        });
        
        test('STO- with empty register gives negative', () => {
            calc.setX(5);
            calc.storeArithmetic(3, 'subtract');
            expect(calc.memory[3]).toBe(-5);
        });
    });
    
    describe('STO× (Store Multiply)', () => {
        test('STO× multiplies memory register by X', () => {
            // Store 4 in R1
            calc.setX(4);
            calc.store(1);
            
            // Multiply R1 by 3 using STO× 1
            calc.setX(3);
            calc.storeArithmetic(1, 'multiply');
            expect(calc.memory[1]).toBe(12);
            expect(calc.getX()).toBe(3); // X unchanged
        });
        
        test('STO× with empty register gives 0', () => {
            calc.setX(7);
            calc.storeArithmetic(4, 'multiply');
            expect(calc.memory[4]).toBe(0);
        });
    });
    
    describe('STO÷ (Store Divide)', () => {
        test('STO÷ divides memory register by X', () => {
            // Store 20 in R1
            calc.setX(20);
            calc.store(1);
            
            // Divide R1 by 4 using STO÷ 1
            calc.setX(4);
            calc.storeArithmetic(1, 'divide');
            expect(calc.memory[1]).toBe(5);
            expect(calc.getX()).toBe(4); // X unchanged
        });
        
        test('STO÷ with empty register gives 0', () => {
            calc.setX(2);
            calc.storeArithmetic(5, 'divide');
            expect(calc.memory[5]).toBe(0);
        });
    });
    
    describe('RCL+ (Recall Add)', () => {
        test('RCL+ adds memory to X and lifts stack', () => {
            calc.setX(10);
            calc.store(1);
            
            calc.setX(5);
            calc.stack[1] = 20; // Set Y for stack lift verification
            
            calc.recallArithmetic(1, 'add');
            
            expect(calc.getX()).toBe(15); // 5 + 10
            expect(calc.stack[1]).toBe(5);  // Old X lifted to Y (getY would return this)
        });
        
        test('RCL+ saves lastX', () => {
            calc.setX(10);
            calc.store(1);
            
            calc.setX(7);
            calc.recallArithmetic(1, 'add');
            
            expect(calc.lastX).toBe(7);
        });
        
        test('RCL+ with empty register adds 0', () => {
            calc.setX(5);
            calc.recallArithmetic(9, 'add');
            expect(calc.getX()).toBe(5);
        });
    });
    
    describe('RCL- (Recall Subtract)', () => {
        test('RCL- subtracts memory from X', () => {
            calc.setX(5);
            calc.store(1);
            
            calc.setX(20);
            calc.recallArithmetic(1, 'subtract');
            
            expect(calc.getX()).toBe(15); // 20 - 5
        });
        
        test('RCL- saves lastX', () => {
            calc.setX(5);
            calc.store(1);
            
            calc.setX(12);
            calc.recallArithmetic(1, 'subtract');
            
            expect(calc.lastX).toBe(12);
        });
    });
    
    describe('RCL× (Recall Multiply)', () => {
        test('RCL× multiplies X by memory', () => {
            calc.setX(3);
            calc.store(1);
            
            calc.setX(4);
            calc.recallArithmetic(1, 'multiply');
            
            expect(calc.getX()).toBe(12); // 4 × 3
        });
        
        test('RCL× saves lastX', () => {
            calc.setX(6);
            calc.store(1);
            
            calc.setX(7);
            calc.recallArithmetic(1, 'multiply');
            
            expect(calc.lastX).toBe(7);
        });
    });
    
    describe('RCL÷ (Recall Divide)', () => {
        test('RCL÷ divides X by memory', () => {
            calc.setX(4);
            calc.store(1);
            
            calc.setX(20);
            calc.recallArithmetic(1, 'divide');
            
            expect(calc.getX()).toBe(5); // 20 ÷ 4
        });
        
        test('RCL÷ saves lastX', () => {
            calc.setX(2);
            calc.store(1);
            
            calc.setX(10);
            calc.recallArithmetic(1, 'divide');
            
            expect(calc.lastX).toBe(10);
        });
    });
    
    describe('Integration Tests', () => {
        test('Complex memory arithmetic sequence', () => {
            // Store 100 in R1
            calc.setX(100);
            calc.store(1);
            
            // Add 50: STO+ 1
            calc.setX(50);
            calc.storeArithmetic(1, 'add');
            expect(calc.memory[1]).toBe(150);
            
            // Subtract 30: STO- 1
            calc.setX(30);
            calc.storeArithmetic(1, 'subtract');
            expect(calc.memory[1]).toBe(120);
            
            // Multiply by 2: STO× 1
            calc.setX(2);
            calc.storeArithmetic(1, 'multiply');
            expect(calc.memory[1]).toBe(240);
            
            // Divide by 4: STO÷ 1
            calc.setX(4);
            calc.storeArithmetic(1, 'divide');
            expect(calc.memory[1]).toBe(60);
        });
        
        test('RCL arithmetic maintains stack lift', () => {
            // Setup: 10 in R1, stack = [5, 4, 3, 2]
            calc.setX(10);
            calc.store(1);
            
            calc.stack = [5, 4, 3, 2];
            
            calc.recallArithmetic(1, 'add');
            
            // X = 5+10=15, Y = 5, Z = 4, T = 3
            expect(calc.getX()).toBe(15);
            expect(calc.stack[1]).toBe(5);
            expect(calc.stack[2]).toBe(4);
            expect(calc.stack[3]).toBe(3);
        });
    });
});
