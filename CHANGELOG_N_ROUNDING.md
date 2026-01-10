# HP-12C N Rounding Implementation

## Summary
Updated the HP-12C simulator to match the authentic behavior of the real HP-12C calculator when calculating N (number of periods) in Time Value of Money problems.

## What Changed

### The Issue
When calculating how long it takes $5,000 to double at 8% annual interest:
- **Real HP-12C**: Returns **10** (rounded up from 9.006)
- **Previous simulator**: Returned **9.01** (mathematically precise)

### The Fix
Modified the `calculateN()` function to **always round up to the next highest integer** using `Math.ceil()`.

**Files Modified:**
1. [calculator-core.js](calculator-core.js) - Lines 92-113
2. [calculator.js](calculator.js) - Lines 967-1001

### Why HP Does This
The HP-12C rounds N up because in practical financial scenarios:
- If you need 9.006 periods to reach a goal
- 9 complete periods won't be enough
- You'll need a 10th period (even if partial) to actually reach your target

This is an **intentional design feature**, not a bug, though it differs from:
- Excel financial functions
- Most other financial calculators
- The exact mathematical result

## Technical Details

### Implementation
```javascript
// Before (returned precise decimal)
return Math.log(numerator / denominator) / Math.log(1 + rate);

// After (rounds up to next integer)
const n = Math.log(numerator / denominator) / Math.log(1 + rate);
return Math.ceil(n);
```

### Test Coverage
Added comprehensive test suite in [calculator-core.test.js](calculator-core.test.js):
- ✅ Doubling at 8% example (9.006 → 10)
- ✅ Fractional periods round up
- ✅ Integer results unchanged
- ✅ Zero interest rate handling
- ✅ BEGIN mode compatibility
- ✅ Other TVM functions NOT affected (PV, FV, PMT, i remain precise)

All 10 tests pass ✓

## Documentation Updates

### FAQ Updated
- Updated "Compound Interest - Time Calculation" example to show correct result: **10 years**
- Added note explaining the rounding behavior
- Added new "Practice Tips" section explaining why HP-12C rounds N up

## Verification

To verify the fix works:

1. Open the simulator
2. Press: `8` `i` (8% interest)
3. Press: `5000` `CHS` `PV` (initial amount)
4. Press: `10000` `FV` (target amount)
5. Press: `n` (calculate)
6. **Result should be: 10** ✓

Or run the test suite:
```bash
npm test
```

## Sources

This behavior is confirmed by multiple HP-12C official sources:
- HP official calculator manuals
- [HP 12C Tutorial, Part II | TVMCalcs.com](https://tvmcalcs.com/hp/hp12c/hp-12c-tutorial-part-ii/)
- [HP 12c Calculator - Time Value of Money Calculations](https://hpofficesupply.com/wp-content/uploads/2021/10/HP-12c-Calculator-Time-Value-of-Money-TVM-Calculation.pdf)

---

**Date:** 2026-01-10
**Version:** Updated to match authentic HP-12C behavior
