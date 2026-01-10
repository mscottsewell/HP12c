/**
 * Integration Tests for HP12c Calculator
 * Verifies complete workflows and multi-step operations
 */

describe('Integration Tests', () => {
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
        calc.clearAll();
        // Reset TVM registers
        calc.n = 0;
        calc.i = 0;
        calc.pv = 0;
        calc.pmt = 0;
        calc.fv = 0;
    });

    describe('Complete TVM Workflow', () => {
        test('Loan payment calculation workflow', () => {
            // 30-year loan, $200,000, 6.5% annual rate
            calc.setX(360);    // 30 years × 12 months
            calc.storeN();
            
            calc.setX(6.5 / 12); // 6.5% annual / 12 = monthly rate
            calc.storeI();
            
            calc.setX(200000); // Loan amount
            calc.storePV();
            
            calc.setX(0);      // FV = 0 (fully paid off)
            calc.storeFV();
            
            calc.calculatePMT();
            
            expect(calc.getX()).toBeCloseTo(-1264.14, 0);
        });

        test('Savings goal calculation workflow', () => {
            // Save $500/month for 10 years at 5% annual to reach FV
            calc.setX(120);    // 10 years × 12 months
            calc.storeN();
            
            calc.setX(5 / 12); // 5% annual / 12 = monthly rate
            calc.storeI();
            
            calc.setX(0);      // PV = 0 (starting from zero)
            calc.storePV();
            
            calc.setX(-500);   // Monthly deposit
            calc.storePMT();
            
            calc.calculateFV();
            
            // FV should be positive (accumulation) - expect around $77,641
            expect(calc.getX()).toBeGreaterThan(70000);
            expect(calc.getX()).toBeLessThan(85000);
        });

        test('Calculate time to pay off debt', () => {
            // $10,000 debt, $200/month payment, 12% APR
            calc.setX(10000);
            calc.storePV();
            
            calc.setX(-200);
            calc.storePMT();
            
            calc.setX(12 / 12); // 12% annual / 12 = 1% monthly
            calc.storeI();
            
            calc.setX(0);      // FV = 0 (fully paid off)
            calc.storeFV();
            
            calc.calculateN();
            
            // Should take around 70 months
            expect(calc.getX()).toBeGreaterThan(0);
            expect(calc.getX()).toBeLessThan(100);
        });
    });

    describe('Cash Flow and NPV/IRR Workflow', () => {
        test('Complete cash flow analysis', () => {
            // Investment: -$10,000 initial, +$3,000 for 5 years
            calc.setX(-10000);
            calc.storeCFo();
            
            calc.setX(3000);
            calc.storeCFj();
            calc.setX(5);
            calc.storeNj();
            
            // NPV at 10% discount rate
            calc.i = 10;
            calc.calculateNPV();
            
            expect(calc.getX()).toBeCloseTo(1372.36, 1);
            
            // IRR
            calc.calculateIRR();
            expect(calc.getX()).toBeCloseTo(15.24, 1);
        });
    });

    describe('Statistics Workflow', () => {
        test('Sigma plus workflow', () => {
            calc.stats = [];
            
            // Enter data points
            calc.setX(1);
            calc.enter();
            calc.setX(2);
            calc.sigmaPlus();
            
            calc.setX(2);
            calc.enter();
            calc.setX(4);
            calc.sigmaPlus();
            
            calc.setX(3);
            calc.enter();
            calc.setX(6);
            calc.sigmaPlus();
            
            // Should have 3 data points
            expect(calc.stats.length).toBe(3);
        });
    });

    describe('Memory Workflow', () => {
        test('Complex memory arithmetic workflow', () => {
            // Store running total in R0
            calc.setX(0);
            calc.store(0);
            
            // Add various amounts
            calc.setX(100);
            calc.storeArithmetic(0, 'add');
            
            calc.setX(50);
            calc.storeArithmetic(0, 'add');
            
            calc.setX(25);
            calc.storeArithmetic(0, 'add');
            
            // Check total
            calc.recall(0);
            expect(calc.getX()).toBe(175);
        });

        test('Memory as intermediate storage in calculation', () => {
            // Calculate: (5 + 3) * (10 - 2)
            
            // First part: 5 + 3 = 8
            calc.setX(5);
            calc.enter();
            calc.setX(3);
            calc.add();
            
            // Store in R1
            calc.store(1);
            
            // Second part: 10 - 2 = 8
            calc.setX(10);
            calc.enter();
            calc.setX(2);
            calc.subtract();
            
            // Multiply by stored value
            calc.recallArithmetic(1, 'multiply');
            
            expect(calc.getX()).toBe(64); // 8 * 8
        });
    });

    describe('RPN Stack Behavior', () => {
        test('Stack lift after operations', () => {
            // Enter 1, 2, 3, 4 into stack
            calc.setX(1);
            calc.enter();
            calc.setX(2);
            calc.enter();
            calc.setX(3);
            calc.enter();
            calc.setX(4);
            
            // Stack should be: T=1, Z=2, Y=3, X=4
            expect(calc.stack[0]).toBe(4);
            expect(calc.stack[1]).toBe(3);
            expect(calc.stack[2]).toBe(2);
            expect(calc.stack[3]).toBe(1);
        });

        test('Stack behavior after ENTER', () => {
            calc.setX(5);
            calc.enter();
            
            // X and Y should both be 5
            expect(calc.stack[0]).toBe(5);
            expect(calc.stack[1]).toBe(5);
            
            // Next digit should not lift stack
            calc.enterDigit('3');
            expect(calc.display).toBe('3');
        });

        test('Complex RPN calculation', () => {
            // Calculate: (3 + 4) * (5 - 2) = 7 * 3 = 21
            // First calculate 3 + 4 = 7
            calc.setX(3);
            calc.enter();
            calc.setX(4);
            calc.add(); // X = 7, Y drops
            
            // Now calculate 5 - 2 = 3
            // But we need to preserve the 7 first
            calc.enter(); // Duplicate 7 into Y
            calc.setX(5);
            calc.enter();
            calc.setX(2);
            calc.subtract(); // X = 3
            
            calc.multiply(); // 7 * 3 = 21
            
            expect(calc.getX()).toBe(21);
        });
    });

    describe('Edge Cases', () => {
        test('Division by zero returns Infinity', () => {
            calc.setX(5);
            calc.enter();
            calc.setX(0);
            calc.divide();
            
            expect(calc.getX()).toBe(Infinity);
        });

        test('Very large numbers in scientific notation', () => {
            calc.setX(1e308);
            expect(calc.getX()).toBe(1e308);
        });

        test('Very small numbers', () => {
            calc.setX(1e-308);
            expect(calc.getX()).toBe(1e-308);
        });

        test('Negative interest rate in TVM', () => {
            calc.n = 12;
            calc.i = -2; // Negative rate
            calc.pv = 1000;
            calc.pmt = 0;
            calc.calculateFV();
            
            // FV should be less than PV with negative rate
            expect(calc.getX()).toBeLessThan(1000);
        });

        test('Zero interest rate in TVM', () => {
            calc.n = 12;
            calc.i = 0;
            calc.pv = 1000;
            calc.pmt = -100;
            calc.calculateFV();
            
            // With 0% interest: FV = -PV - PMT*n
            expect(calc.getX()).toBe(200); // -1000 - (-100*12) = -1000 + 1200 = 200
        });

        test('Empty cash flow array for NPV', () => {
            calc.cashFlows = [];
            calc.calculateNPV();
            expect(calc.getX()).toBe(0);
        });

        test('Empty cash flow array for IRR', () => {
            calc.cashFlows = [];
            calc.calculateIRR();
            expect(calc.getX()).toBe(0);
        });

        test('Single cash flow for IRR', () => {
            calc.cashFlows = [-1000];
            calc.calculateIRR();
            expect(calc.getX()).toBe(0);
        });
    });
});
