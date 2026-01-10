/**
 * Tests for HP12c Calculator EEX (Scientific Notation) Functionality
 * Verifies proper exponent entry, display, and calculation
 */

describe('EEX (Scientific Notation Entry)', () => {
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
        calc.clearAll(); // Reset calculator state
    });

    describe('Basic EEX Entry', () => {
        test('1.5 EEX 3 = 1500', () => {
            calc.enterDigit('1');
            calc.enterDecimal();
            calc.enterDigit('5');
            calc.enterExponent();
            calc.enterDigit('3');
            calc.enter();
            
            expect(calc.getX()).toBe(1500);
        });

        test('2 EEX 5 = 200000', () => {
            calc.enterDigit('2');
            calc.enterExponent();
            calc.enterDigit('5');
            calc.enter();
            
            expect(calc.getX()).toBe(200000);
        });

        test('6.02 EEX 23 = 6.02×10²³', () => {
            calc.enterDigit('6');
            calc.enterDecimal();
            calc.enterDigit('0');
            calc.enterDigit('2');
            calc.enterExponent();
            calc.enterDigit('2');
            calc.enterDigit('3');
            calc.enter();
            
            expect(calc.getX()).toBeCloseTo(6.02e23, -10);
        });
    });

    describe('Negative Exponents (CHS)', () => {
        test('2 EEX CHS 4 = 0.0002', () => {
            calc.enterDigit('2');
            calc.enterExponent();
            calc.changeSign();
            calc.enterDigit('4');
            calc.enter();
            
            expect(calc.getX()).toBeCloseTo(0.0002, 10);
        });

        test('1.5 EEX CHS 3 = 0.0015', () => {
            calc.enterDigit('1');
            calc.enterDecimal();
            calc.enterDigit('5');
            calc.enterExponent();
            calc.changeSign();
            calc.enterDigit('3');
            calc.enter();
            
            expect(calc.getX()).toBe(0.0015);
        });

        test('CHS toggles exponent sign, not mantissa', () => {
            calc.enterDigit('5');
            calc.enterExponent();
            calc.enterDigit('2');
            
            // Display should show "5e2"
            expect(calc.display).toBe('5e2');
            
            calc.changeSign();
            
            // Display should now show "5e-2"
            expect(calc.display).toBe('5e-2');
            
            calc.enter();
            expect(calc.getX()).toBe(0.05); // 5 × 10^-2
        });

        test('Toggle exponent sign back to positive', () => {
            calc.enterDigit('3');
            calc.enterExponent();
            calc.changeSign();
            calc.enterDigit('4');
            
            // Should be 3e-4
            expect(calc.display).toBe('3e-4');
            
            // Toggle back
            calc.changeSign();
            expect(calc.display).toBe('3e4');
            
            calc.enter();
            expect(calc.getX()).toBe(30000);
        });
    });

    describe('EEX with Operations', () => {
        test('Scientific notation addition', () => {
            // 1e3 + 2e2 = 1000 + 200 = 1200
            calc.enterDigit('1');
            calc.enterExponent();
            calc.enterDigit('3');
            calc.enter();
            
            calc.enterDigit('2');
            calc.enterExponent();
            calc.enterDigit('2');
            calc.add();
            
            expect(calc.getX()).toBe(1200);
        });

        test('Scientific notation multiplication', () => {
            // 2e3 × 3e2 = 2000 × 300 = 600000
            calc.enterDigit('2');
            calc.enterExponent();
            calc.enterDigit('3');
            calc.enter();
            
            calc.enterDigit('3');
            calc.enterExponent();
            calc.enterDigit('2');
            calc.multiply();
            
            expect(calc.getX()).toBe(600000);
        });

        test('Scientific notation division', () => {
            // 6e4 ÷ 2e2 = 60000 ÷ 200 = 300
            calc.enterDigit('6');
            calc.enterExponent();
            calc.enterDigit('4');
            calc.enter();
            
            calc.enterDigit('2');
            calc.enterExponent();
            calc.enterDigit('2');
            calc.divide();
            
            expect(calc.getX()).toBe(300);
        });

        test('Power with scientific notation', () => {
            // 10 y^x 2e1 = 10^20
            calc.enterDigit('1');
            calc.enterDigit('0');
            calc.enter();
            
            calc.enterDigit('2');
            calc.enterExponent();
            calc.enterDigit('1');
            calc.power();
            
            expect(calc.getX()).toBe(1e20);
        });
    });

    describe('Edge Cases', () => {
        test('Empty exponent defaults to 0', () => {
            calc.enterDigit('5');
            calc.enterExponent();
            // Press ENTER without entering exponent digits
            calc.enter();
            
            expect(calc.getX()).toBe(5); // 5e0 = 5
        });

        test('EEX on new number starts with 1', () => {
            calc.enterExponent();
            calc.enterDigit('3');
            calc.enter();
            
            expect(calc.getX()).toBe(1000); // 1e3
        });

        test('Cannot enter EEX twice', () => {
            calc.enterDigit('2');
            calc.enterExponent();
            calc.enterDigit('3');
            calc.enterExponent(); // Second EEX should be ignored
            
            expect(calc.display).toBe('2e3');
        });

        test('Exponent limited to 2 digits', () => {
            calc.enterDigit('1');
            calc.enterExponent();
            calc.enterDigit('9');
            calc.enterDigit('9');
            calc.enterDigit('9'); // Third digit should be ignored
            
            expect(calc.display).toBe('1e99');
        });

        test('Negative mantissa with positive exponent', () => {
            calc.enterDigit('5');
            calc.changeSign(); // Toggle mantissa to negative
            calc.enterExponent();
            calc.enterDigit('2');
            calc.enter();
            
            expect(calc.getX()).toBe(-500); // -5 × 10^2
        });

        test('Negative mantissa with negative exponent', () => {
            calc.enterDigit('4');
            calc.changeSign(); // Toggle mantissa to negative
            calc.enterExponent();
            calc.changeSign(); // Toggle exponent to negative
            calc.enterDigit('2');
            calc.enter();
            
            expect(calc.getX()).toBe(-0.04); // -4 × 10^-2
        });
    });

    describe('Display Format', () => {
        test('EEX displays "e" character', () => {
            calc.enterDigit('3');
            calc.enterExponent();
            
            expect(calc.display).toContain('e');
        });

        test('Display shows mantissa and exponent', () => {
            calc.enterDigit('1');
            calc.enterDecimal();
            calc.enterDigit('2');
            calc.enterExponent();
            calc.enterDigit('5');
            
            expect(calc.display).toBe('1.2e5');
        });

        test('Display shows negative exponent', () => {
            calc.enterDigit('7');
            calc.enterExponent();
            calc.changeSign();
            calc.enterDigit('3');
            
            expect(calc.display).toBe('7e-3');
        });
    });
});
