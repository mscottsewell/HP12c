/**
 * Tests for HP12c Calculator LastX Register
 * Verifies that the LastX register matches real HP-12C behavior
 */

describe('HP-12C LastX Register', () => {
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
        calc = window.calculator;
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        // Reset calculator state before each test
        calc.stack = [0, 0, 0, 0];
        calc.lastX = 0;
        calc.isTyping = false;
        calc.isNewNumber = true;
    });

    describe('Arithmetic Operations', () => {
        test('addition should save X in lastX', () => {
            // 5 + 3 = 8, lastX should be 3
            calc.stack[0] = 3;
            calc.stack[1] = 5;
            calc.add();

            expect(calc.getX()).toBe(8);
            expect(calc.lastX).toBe(3);
        });

        test('subtraction should save X in lastX', () => {
            // 10 - 4 = 6, lastX should be 4
            calc.stack[0] = 4;
            calc.stack[1] = 10;
            calc.subtract();

            expect(calc.getX()).toBe(6);
            expect(calc.lastX).toBe(4);
        });

        test('multiplication should save X in lastX', () => {
            // 6 × 7 = 42, lastX should be 7
            calc.stack[0] = 7;
            calc.stack[1] = 6;
            calc.multiply();

            expect(calc.getX()).toBe(42);
            expect(calc.lastX).toBe(7);
        });

        test('division should save X in lastX', () => {
            // 20 ÷ 4 = 5, lastX should be 4
            calc.stack[0] = 4;
            calc.stack[1] = 20;
            calc.divide();

            expect(calc.getX()).toBe(5);
            expect(calc.lastX).toBe(4);
        });

        test('power should save X in lastX', () => {
            // 2^3 = 8, lastX should be 3 (exponent)
            calc.stack[0] = 3;
            calc.stack[1] = 2;
            calc.power();

            expect(calc.getX()).toBe(8);
            expect(calc.lastX).toBe(3);
        });
    });

    describe('Mathematical Functions', () => {
        test('reciprocal should save X in lastX', () => {
            calc.stack[0] = 8;
            calc.reciprocal();

            expect(calc.getX()).toBe(0.125);
            expect(calc.lastX).toBe(8);
        });

        test('square root should save X in lastX', () => {
            calc.stack[0] = 144;
            calc.squareRoot();

            expect(calc.getX()).toBe(12);
            expect(calc.lastX).toBe(144);
        });

        test('natural log should save X in lastX', () => {
            calc.stack[0] = Math.E;
            calc.naturalLog();

            expect(calc.getX()).toBeCloseTo(1, 10);
            expect(calc.lastX).toBeCloseTo(Math.E, 10);
        });

        test('exponential should save X in lastX', () => {
            calc.stack[0] = 1;
            calc.exponential();

            expect(calc.getX()).toBeCloseTo(Math.E, 10);
            expect(calc.lastX).toBe(1);
        });

        test('factorial should save X in lastX', () => {
            calc.stack[0] = 5;
            calc.factorial();

            expect(calc.getX()).toBe(120);
            expect(calc.lastX).toBe(5);
        });

        test('fractional part should save X in lastX', () => {
            calc.stack[0] = 3.75;
            calc.fractionalPart();

            expect(calc.getX()).toBeCloseTo(0.75, 10);
            expect(calc.lastX).toBe(3.75);
        });

        test('integer part should save X in lastX', () => {
            calc.stack[0] = 3.75;
            calc.integerPart();

            expect(calc.getX()).toBe(3);
            expect(calc.lastX).toBe(3.75);
        });
    });

    describe('Percentage Functions', () => {
        test('percent should save X in lastX', () => {
            // 15% of 250 = 37.5, lastX should be 15
            calc.stack[0] = 15;
            calc.stack[1] = 250;
            calc.percent();

            expect(calc.getX()).toBeCloseTo(37.5, 10);
            expect(calc.lastX).toBe(15);
        });

        test('percent of total should save X in lastX', () => {
            // 45 is what % of 180 = 25%, lastX should be 45
            calc.stack[0] = 45;
            calc.stack[1] = 180;
            calc.percentOfTotal();

            expect(calc.getX()).toBeCloseTo(25, 10);
            expect(calc.lastX).toBe(45);
        });

        test('percent change should save X in lastX', () => {
            // Change from 80 to 95 = 18.75%, lastX should be 95
            calc.stack[0] = 95;
            calc.stack[1] = 80;
            calc.percentChange();

            expect(calc.getX()).toBeCloseTo(18.75, 10);
            expect(calc.lastX).toBe(95);
        });
    });

    describe('TVM Calculations', () => {
        test('calculateN should save X in lastX', () => {
            calc.i = 8;
            calc.pv = -5000;
            calc.pmt = 0;
            calc.fv = 10000;
            calc.stack[0] = 999; // Some value in X before calculation

            calc.calculateN();

            expect(calc.getX()).toBe(10); // Rounded up from 9.006
            expect(calc.lastX).toBe(999); // Previous X value saved
        });

        test('calculateI should save X in lastX', () => {
            calc.n = 10;
            calc.pv = -1000;
            calc.pmt = 0;
            calc.fv = 2000;
            calc.stack[0] = 555; // Some value in X before calculation

            calc.calculateI();

            expect(calc.getX()).toBeCloseTo(7.177, 2);
            expect(calc.lastX).toBe(555);
        });

        test('calculatePV should save X in lastX', () => {
            calc.n = 10;
            calc.i = 8;
            calc.pmt = 0;
            calc.fv = 10000;
            calc.stack[0] = 777; // Some value in X before calculation

            calc.calculatePV();

            expect(calc.getX()).toBeCloseTo(-4631.93, 2);
            expect(calc.lastX).toBe(777);
        });

        test('calculatePMT should save X in lastX', () => {
            calc.n = 10;
            calc.i = 8;
            calc.pv = -5000;
            calc.fv = 0;
            calc.stack[0] = 333; // Some value in X before calculation

            calc.calculatePMT();

            expect(calc.getX()).toBeCloseTo(745.15, 2);
            expect(calc.lastX).toBe(333);
        });

        test('calculateFV should save X in lastX', () => {
            calc.n = 10;
            calc.i = 8;
            calc.pv = -5000;
            calc.pmt = 0;
            calc.stack[0] = 222; // Some value in X before calculation

            calc.calculateFV();

            expect(calc.getX()).toBeCloseTo(10794.62, 2);
            expect(calc.lastX).toBe(222);
        });
    });

    describe('Cash Flow Functions', () => {
        test('calculateNPV should save X in lastX', () => {
            calc.cashFlows = [-1000, 300, 400, 500];
            calc.cashFlowCounts = [1, 1, 1, 1];
            calc.i = 10;
            calc.stack[0] = 888; // Some value in X before calculation

            calc.calculateNPV();

            expect(calc.getX()).toBeCloseTo(-21.04, 2);
            expect(calc.lastX).toBe(888);
        });

        test('calculateIRR should save X in lastX', () => {
            calc.cashFlows = [-1000, 300, 400, 500];
            calc.cashFlowCounts = [1, 1, 1, 1];
            calc.stack[0] = 444; // Some value in X before calculation

            calc.calculateIRR();

            expect(calc.getX()).toBeCloseTo(8.9, 1);
            expect(calc.lastX).toBe(444);
        });
    });

    describe('LastX Recall (g-LSTx)', () => {
        test('should recall lastX after arithmetic operation', () => {
            // 5 + 3 = 8, then g-LSTx should recall 3
            calc.stack[0] = 3;
            calc.stack[1] = 5;
            calc.add();

            expect(calc.getX()).toBe(8);

            // Recall lastX
            calc.recallLastX();

            expect(calc.getX()).toBe(3);
        });

        test('should allow error recovery with lastX', () => {
            // Real-world use case: 100 × 1.5 = 150
            // Oops, meant to use 1.8, use lastX to fix
            calc.stack[0] = 1.5;
            calc.stack[1] = 100;
            calc.multiply();

            expect(calc.getX()).toBe(150);
            expect(calc.lastX).toBe(1.5);

            // Undo by dividing by lastX
            calc.recallLastX(); // Get 1.5 back
            expect(calc.getX()).toBe(1.5);
            
            // Now divide 150 by 1.5
            calc.stack[1] = 150;
            calc.divide();
            expect(calc.getX()).toBe(100);

            // Now multiply by correct value 1.8
            calc.stack[0] = 1.8;
            calc.stack[1] = 100;
            calc.multiply();
            expect(calc.getX()).toBe(180);
        });
    });

    describe('RCL Should Not Affect LastX', () => {
        test('RCL should not change lastX', () => {
            // Store 42 in register 1
            calc.stack[0] = 42;
            calc.store(1);

            // Perform an operation to set lastX
            calc.stack[0] = 5;
            calc.stack[1] = 10;
            calc.add();

            expect(calc.getX()).toBe(15);
            expect(calc.lastX).toBe(5);

            // Recall from register 1 - should NOT change lastX
            calc.recall(1);

            expect(calc.getX()).toBe(42);
            expect(calc.lastX).toBe(5); // Should still be 5, not 42
        });
    });
});
