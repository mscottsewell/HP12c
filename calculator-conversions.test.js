/**
 * Tests for HP12c Calculator Conversion Functions and Cash Flow Sum
 * Verifies polar/rect conversions, HMS/hours, deg/rad, and f-Σ
 */

describe('Conversion Functions and Cash Flow Sum', () => {
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
        calc.cashFlows = [];
        calc.cashFlowCounts = [];
    });

    describe('Polar to Rectangular Conversion (f-→R)', () => {
        test('Convert (5, 53.13°) polar to (3, 4) rectangular', () => {
            // polarToRect expects: Y=θ, X=r
            // So enter θ=53.13 first, then r=5
            calc.setX(5);      // r in X
            calc.enter();      // Move r to Y
            calc.setX(53.13);  // θ in X
            
            calc.polarToRect();
            
            expect(calc.getX()).toBeCloseTo(3, 1); // x coordinate
            expect(calc.stack[1]).toBeCloseTo(4, 1); // y coordinate
        });

        test('Convert (10, 45°) to rectangular', () => {
            calc.setX(10);
            calc.enter();
            calc.setX(45);
            
            calc.polarToRect();
            
            // 10 * cos(45°) ≈ 7.07, 10 * sin(45°) ≈ 7.07
            expect(calc.getX()).toBeCloseTo(7.071, 2);
            expect(calc.stack[1]).toBeCloseTo(7.071, 2);
        });
    });

    describe('Rectangular to Polar Conversion (g-→P)', () => {
        test('Convert (3, 4) rectangular to (5, 53.13°) polar', () => {
            // Enter x = 3, y = 4
            calc.setX(3);
            calc.enter();
            calc.setX(4);
            
            calc.rectToPolar();
            
            expect(calc.getX()).toBeCloseTo(5, 2); // r = √(3²+4²) = 5
            expect(calc.stack[1]).toBeCloseTo(53.13, 1); // θ ≈ 53.13°
        });

        test('Convert (-3, 4) rectangular to polar', () => {
            calc.setX(-3);
            calc.enter();
            calc.setX(4);
            
            calc.rectToPolar();
            
            expect(calc.getX()).toBeCloseTo(5, 2); // r = 5
            expect(calc.stack[1]).toBeCloseTo(126.87, 1); // θ in second quadrant
        });
    });

    describe('Hours to HMS Conversion (g-→H)', () => {
        test('Convert 2.5 hours to H.MS = 2.30', () => {
            calc.setX(2.5);
            calc.hoursToHMS();
            
            // 2.5 hours = 2 hours 30 minutes 0 seconds = 2.3000
            expect(calc.getX()).toBeCloseTo(2.30, 2);
        });

        test('Convert 1.75 hours to H.MS = 1.4500', () => {
            calc.setX(1.75);
            calc.hoursToHMS();
            
            // 1.75 hours = 1 hour 45 minutes = 1.4500
            expect(calc.getX()).toBeCloseTo(1.45, 2);
        });

        test('Convert 3.25 hours to H.MS', () => {
            calc.setX(3.25);
            calc.hoursToHMS();
            
            // 3.25 hours = 3 hours 15 minutes = 3.1500
            expect(calc.getX()).toBeCloseTo(3.15, 2);
        });
    });

    describe('HMS to Hours Conversion (reverse of →H)', () => {
        test('Convert 2.30 (H.MS) to 2.5 hours', () => {
            calc.setX(2.30); // 2 hours 30 minutes
            calc.hmsToHours();
            
            expect(calc.getX()).toBeCloseTo(2.5, 1);
        });

        test('Convert 1.45 (H.MS) to 1.75 hours', () => {
            calc.setX(1.45); // 1 hour 45 minutes
            calc.hmsToHours();
            
            expect(calc.getX()).toBeCloseTo(1.75, 1);
        });

        test('Round trip: hours → HMS → hours', () => {
            calc.setX(3.333); // 3.333 hours
            calc.hoursToHMS();
            const hms = calc.getX();
            
            calc.hmsToHours();
            
            expect(calc.getX()).toBeCloseTo(3.333, 1);
        });
    });

    describe('Radians to Degrees Conversion (g-→DEG)', () => {
        test('Convert π/2 radians to 90 degrees', () => {
            calc.setX(Math.PI / 2);
            calc.radToDeg();
            
            expect(calc.getX()).toBeCloseTo(90, 5);
        });

        test('Convert π radians to 180 degrees', () => {
            calc.setX(Math.PI);
            calc.radToDeg();
            
            expect(calc.getX()).toBeCloseTo(180, 5);
        });

        test('Convert 2π radians to 360 degrees', () => {
            calc.setX(2 * Math.PI);
            calc.radToDeg();
            
            expect(calc.getX()).toBeCloseTo(360, 5);
        });
    });

    describe('Degrees to Radians Conversion (g-→RAD)', () => {
        test('Convert 90 degrees to π/2 radians', () => {
            calc.setX(90);
            calc.degToRad();
            
            expect(calc.getX()).toBeCloseTo(Math.PI / 2, 5);
        });

        test('Convert 180 degrees to π radians', () => {
            calc.setX(180);
            calc.degToRad();
            
            expect(calc.getX()).toBeCloseTo(Math.PI, 5);
        });

        test('Round trip: degrees → radians → degrees', () => {
            calc.setX(45);
            calc.degToRad();
            calc.radToDeg();
            
            expect(calc.getX()).toBeCloseTo(45, 5);
        });
    });

    describe('Cash Flow Sum (f-Σ)', () => {
        test('Sum simple cash flows', () => {
            // CFo = -1000, CFj = 300, CFj = 400, CFj = 500
            calc.setX(-1000);
            calc.storeCFo();
            
            calc.setX(300);
            calc.storeCFj();
            
            calc.setX(400);
            calc.storeCFj();
            
            calc.setX(500);
            calc.storeCFj();
            
            calc.sumCashFlows();
            
            // Sum = -1000 + 300 + 400 + 500 = 200
            expect(calc.getX()).toBe(200);
        });

        test('Sum with repeated cash flows (Nj)', () => {
            // CFo = -1000, CFj = 100 (occurs 5 times)
            calc.setX(-1000);
            calc.storeCFo();
            
            calc.setX(100);
            calc.storeCFj();
            
            calc.setX(5); // Nj = 5
            calc.storeNj();
            
            calc.sumCashFlows();
            
            // Sum = -1000 + (100 * 5) = -500
            expect(calc.getX()).toBe(-500);
        });

        test('Sum with multiple repeated cash flows', () => {
            // CFo = -5000, CFj = 1000 (×3), CFj = 2000 (×2)
            calc.setX(-5000);
            calc.storeCFo();
            
            calc.setX(1000);
            calc.storeCFj();
            calc.setX(3);
            calc.storeNj();
            
            calc.setX(2000);
            calc.storeCFj();
            calc.setX(2);
            calc.storeNj();
            
            calc.sumCashFlows();
            
            // Sum = -5000 + (1000×3) + (2000×2) = -5000 + 3000 + 4000 = 2000
            expect(calc.getX()).toBe(2000);
        });

        test('Sum with no cash flows returns 0', () => {
            calc.sumCashFlows();
            expect(calc.getX()).toBe(0);
        });

        test('Sum with only CFo', () => {
            calc.setX(-1000);
            calc.storeCFo();
            
            calc.sumCashFlows();
            
            expect(calc.getX()).toBe(-1000);
        });
    });
});
