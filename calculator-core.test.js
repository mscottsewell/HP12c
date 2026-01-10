/**
 * Tests for HP12c Calculator Core Functions
 * Verifies that the calculator matches real HP-12C behavior
 */

const {
    calculateN,
    calculateI,
    calculatePV,
    calculateFV,
    calculatePMT
} = require('./calculator-core.js');

describe('HP-12C TVM Calculations', () => {
    describe('calculateN - Number of Periods', () => {
        test('should round up 9.006 to 10 for the doubling at 8% example', () => {
            // Real HP-12C test case:
            // 8 i (8% annual interest)
            // 5000 CHS PV (initial amount, negative)
            // 10000 FV (target amount)
            // n (calculate time periods)
            // Expected result: 10 (not 9.01)

            const i = 8;           // 8% interest
            const pv = -5000;      // Present value (negative - cash outflow)
            const pmt = 0;         // No periodic payments
            const fv = 10000;      // Future value (positive - cash inflow)

            const result = calculateN(i, pv, pmt, fv);

            // Real HP-12C returns 10 (rounded up from 9.006...)
            expect(result).toBe(10);
        });

        test('should round up fractional periods to next integer', () => {
            // Test with different values that should round up
            const i = 10;          // 10% interest
            const pv = -1000;      // Present value
            const pmt = 0;         // No periodic payments
            const fv = 2000;       // Double the money

            const result = calculateN(i, pv, pmt, fv);

            // Exact answer is ~7.27, should round up to 8
            expect(result).toBe(8);
        });

        test('should handle exact integer results', () => {
            // When result is already an integer, it should stay the same
            const i = 100;         // 100% interest (doubles each period)
            const pv = -1000;      // Present value
            const pmt = 0;         // No periodic payments
            const fv = 2000;       // Double the money

            const result = calculateN(i, pv, pmt, fv);

            // Exact answer is 1.0, should stay 1
            expect(result).toBe(1);
        });

        test('should handle exact integer for zero interest rate', () => {
            const i = 0;           // 0% interest
            const pv = -1000;      // Present value
            const pmt = 100;       // Payment per period
            const fv = -500;       // Future value (same sign as pv for this example)

            const result = calculateN(i, pv, pmt, fv);

            // -(pv + fv) / pmt = -(-1000 + -500) / 100 = 1500 / 100 = 15
            expect(result).toBe(15);
        });

        test('should round up fractional result with zero interest', () => {
            const i = 0;           // 0% interest
            const pv = -1000;      // Present value
            const pmt = 90;        // Payment per period
            const fv = -500;       // Future value

            const result = calculateN(i, pv, pmt, fv);

            // -(pv + fv) / pmt = -(-1000 + -500) / 90 = 1500 / 90 = 16.666..., should round up to 17
            expect(result).toBe(17);
        });

        test('should handle begin mode with rounding', () => {
            const i = 8;           // 8% interest
            const pv = -5000;      // Present value
            const pmt = 0;         // No periodic payments
            const fv = 10000;      // Future value
            const beginMode = true;

            const result = calculateN(i, pv, pmt, fv, beginMode);

            // Should still round up to integer
            expect(Number.isInteger(result)).toBe(true);
            expect(result).toBeGreaterThan(0);
        });
    });

    describe('Other TVM functions should NOT round', () => {
        test('calculatePV should return precise decimal values', () => {
            const n = 10;
            const i = 8;
            const pmt = 0;
            const fv = 10000;

            const result = calculatePV(n, i, pmt, fv);

            // Should be precise, not rounded to integer
            expect(result).toBeCloseTo(-4631.93, 2);
        });

        test('calculateFV should return precise decimal values', () => {
            const n = 10;
            const i = 8;
            const pv = -5000;
            const pmt = 0;

            const result = calculateFV(n, i, pv, pmt);

            // Should be precise, not rounded to integer
            expect(result).toBeCloseTo(10794.62, 2);
        });

        test('calculatePMT should return precise decimal values', () => {
            const n = 10;
            const i = 8;
            const pv = -5000;
            const fv = 0;

            const result = calculatePMT(n, i, pv, fv);

            // Should be precise, not rounded to integer
            expect(result).toBeCloseTo(745.15, 2);
        });

        test('calculateI should return precise percentage values', () => {
            const n = 10;
            const pv = -5000;
            const pmt = 0;
            const fv = 10000;

            const result = calculateI(n, pv, pmt, fv);

            // Should be precise percentage, not rounded to integer
            expect(result).toBeCloseTo(7.177, 2);
        });
    });
});
